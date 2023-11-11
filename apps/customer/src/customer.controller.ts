import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';

import { CustomerService } from './services/customer.service';
import { ICustomer } from './interfaces/customer.interface';
import { ICustomerCreateResponse } from './interfaces/customer-create-response.interface';
import { ICustomerSearchResponse } from './interfaces/customer-search-response.interface';
import { ICustomerConfirmResponse } from './interfaces/customer-confirm-response.interface';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    @Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy
  ) {}

  @MessagePattern('customer_search_by_credentials')
  public async searchCustomerByCredentials(searchParams: {
    email: string;
    password: string;
  }): Promise<ICustomerSearchResponse> {
    let result: ICustomerSearchResponse;
    console.log(searchParams);

    if (searchParams.email && searchParams.password) {
      const customer = await this.customerService.searchCustomer({
        email: searchParams.email,
      });

      if (customer && customer[0]) {
        if (await customer[0].compareEncryptedPassword(searchParams.password)) {
          result = {
            status: HttpStatus.OK,
            message: 'customer_search_by_credentials_success',
            data: customer[0],
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'customer_search_by_credentials_not_match',
            data: null,
          };
        }
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'customer_search_by_credentials_not_found',
          data: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'customer_search_by_credentials_not_found',
        data: null,
      };
    }

    return result;
  }

  @MessagePattern('customer_get_by_id')
  public async getCustomerById(id: string): Promise<ICustomerSearchResponse> {
    let result: ICustomerSearchResponse;

    if (id) {
      const customer = await this.customerService.searchCustomerById(id);
      if (customer) {
        result = {
          status: HttpStatus.OK,
          message: 'customer_get_by_id_success',
          data: customer,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'customer_get_by_id_not_found',
          data: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'customer_get_by_id_bad_request',
        data: null,
      };
    }

    return result;
  }

  @MessagePattern('customer_confirm')
  public async confirmCustomer(confirmParams: {
    link: string;
  }): Promise<ICustomerConfirmResponse> {
    let result: ICustomerConfirmResponse;

    if (confirmParams) {
      const customerLink = await this.customerService.getCustomerLink(
        confirmParams.link
      );

      if (customerLink && customerLink[0]) {
        const customerId = customerLink[0].customer_id;
        await this.customerService.updateCustomerById(customerId, {
          is_confirmed: true,
        });
        await this.customerService.updateCustomerLinkById(customerLink[0].id, {
          is_used: true,
        });
        result = {
          status: HttpStatus.OK,
          message: 'customer_confirm_success',
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'customer_confirm_not_found',
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'customer_confirm_bad_request',
      };
    }

    return result;
  }

  @MessagePattern('customer_create')
  public async createCustomer(
    customerParams: ICustomer
  ): Promise<ICustomerCreateResponse> {
    let result: ICustomerCreateResponse;

    if (customerParams) {
      const customersWithEmail = await this.customerService.searchCustomer({
        email: customerParams.email,
      });

      if (customersWithEmail && customersWithEmail.length > 0) {
        result = {
          status: HttpStatus.CONFLICT,
          message: 'Email already exists',
          data: null,
        };
      } else {
        try {
          customerParams.is_confirmed = false;
          const createdCustomer = await this.customerService.createCustomer(
            customerParams
          );
          const customerLink = await this.customerService.createCustomerLink(
            createdCustomer.id
          );
          delete createdCustomer.password;
          result = {
            status: HttpStatus.CREATED,
            message: 'customer_create_success',
            data: createdCustomer,
          };
          this.mailerServiceClient.send('mail_send', {
            to: createdCustomer.email,
            subject: 'Email confirmation',
            html: `<center>
              <b>Hi there, please confirm your email to use Smoothday.</b><br>
              Use the following link for this.<br>
              <a href="${this.customerService.getConfirmationLink(
                customerLink.link
              )}"><b>Confirm The Email</b></a>
              </center>`,
          });
        } catch (e) {
          result = {
            status: HttpStatus.PRECONDITION_FAILED,
            message: e.errors,
            data: null,
          };
        }
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'customer_create_bad_request',
        data: null,
      };
    }

    return result;
  }
  @MessagePattern('findAllCustomer')
  public async findAllCustomer() {
    return await this.customerService.findAllCustomer();
  }
}
