import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Authorization } from '../decorators/authorization.decorator';
import { IAuthorizedRequest } from '../interfaces/common/authorized-request.interface';
import {
  IServiveTokenCreateResponse,
  IServiceTokenDestroyResponse,
} from '../interfaces/token';
import {
  ConfirmCustomerDto,
  ConfirmCustomerResponseDto,
  CreateCustomerDto,
  CreateCustomerResponseDto,
  GetCustomerByTokenResponseDto,
  IServiceCustomerConfirmResponse,
  IServiceCustomerCreateResponse,
  IServiceCustomerGetByIdResponse,
  IServiceCustomerSearchResponse,
  LoginCustomerDto,
  LoginCustomerResponseDto,
  LogoutCustomerResponseDto,
} from '../interfaces/customer';
@ApiBearerAuth()
@Controller('customer')
@ApiTags('customers')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);
  constructor(
    @Inject('CUSTOMER_SERVICE') private readonly customerService: ClientProxy,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy
  ) {}
  @Get()
  @Authorization(true)
  @ApiOkResponse({
    type: GetCustomerByTokenResponseDto,
  })
  public async getCustomerByToken(
    @Req() request: IAuthorizedRequest
  ): Promise<GetCustomerByTokenResponseDto> {
    const customerInfo = request.customer;

    const customerResponse: IServiceCustomerGetByIdResponse =
      await firstValueFrom(
        this.customerService.send('customer_get_by_id', customerInfo.id)
      );

    return {
      message: customerResponse.message,
      data: {
        customer: customerResponse.customer,
      },
      errors: null,
    };
  }

  @Post()
  @ApiCreatedResponse({
    type: CreateCustomerResponseDto,
  })
  public async createCustomer(
    @Body() customerRequest: CreateCustomerDto
  ): Promise<CreateCustomerResponseDto> {
    const createCustomerResponse: IServiceCustomerCreateResponse =
      await firstValueFrom(
        this.customerService.send('customer_create', customerRequest)
      );
    if (createCustomerResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createCustomerResponse.message,
          data: null,
          errors: createCustomerResponse.errors,
        },
        createCustomerResponse.status
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_create', {
          customerId: createCustomerResponse.customer.id,
        })
      );

    return {
      message: createCustomerResponse.message,
      data: {
        customer: createCustomerResponse.customer,
        token: createTokenResponse.token,
      },
      errors: null,
    };
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: LoginCustomerResponseDto,
  })
  public async loginCustomer(
    @Body() loginRequest: LoginCustomerDto
  ): Promise<LoginCustomerResponseDto> {
    const getCustomerResponse: IServiceCustomerSearchResponse =
      await firstValueFrom(
        this.customerService.send(
          'customer_search_by_credentials',
          loginRequest
        )
      );

    if (getCustomerResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getCustomerResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_create', {
          customerId: getCustomerResponse.customer.id,
        })
      );

    return {
      message: createTokenResponse.message,
      data: {
        token: createTokenResponse.token,
      },
      errors: null,
    };
  }

  @Put('/logout')
  @Authorization(true)
  @ApiCreatedResponse({
    type: LogoutCustomerResponseDto,
  })
  public async logoutCustomer(
    @Req() request: IAuthorizedRequest
  ): Promise<LogoutCustomerResponseDto> {
    const customerInfo = request.customer;

    const destroyTokenResponse: IServiceTokenDestroyResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_destroy', {
          customerId: customerInfo.id,
        })
      );

    if (destroyTokenResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: destroyTokenResponse.message,
          data: null,
          errors: destroyTokenResponse.errors,
        },
        destroyTokenResponse.status
      );
    }

    return {
      message: destroyTokenResponse.message,
      errors: null,
      data: null,
    };
  }

  @Get('/confirm/:link')
  @ApiCreatedResponse({
    type: ConfirmCustomerResponseDto,
  })
  public async confirmCustomer(
    @Param() params: ConfirmCustomerDto
  ): Promise<ConfirmCustomerResponseDto> {
    const confirmCustomerResponse: IServiceCustomerConfirmResponse =
      await firstValueFrom(
        this.customerService.send('customer_confirm', {
          link: params.link,
        })
      );

    if (confirmCustomerResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: confirmCustomerResponse.message,
          data: null,
          errors: confirmCustomerResponse.errors,
        },
        confirmCustomerResponse.status
      );
    }

    return {
      message: confirmCustomerResponse.message,
      errors: null,
      data: null,
    };
  }
}
