import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import {
  Authorization,
  AuthorizationRefresh,
} from '../../decorators/authorization.decorator';
import { IAuthorizedRequest } from '../../interfaces/common/authorized-request.interface';
import { BaseReponse } from '../../interfaces/common/base-reponse.dto';
import {
  IServiveTokenCreateResponse,
  IServiceTokenDestroyResponse,
} from '../../interfaces/token';
import {
  ConfirmCustomerDto,
  ConfirmCustomerResponseDto,
  CreateCustomerDto,
  CreateCustomerResponseDto,
  GetCustomerByTokenResponseDto,
  LoginCustomerDto,
  LoginCustomerResponseDto,
  LogoutCustomerResponseDto,
} from './dto';
import { findAllCustomerResponseDTO } from './dto/find-all-customer-response.dto';
import { FindCustomerDTO } from './dto/find-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { IServiceCustomerConfirmResponse } from './service-customer-confirm-response.interface';
import { IServiceCustomerCreateResponse } from './service-customer-create-response.interface';
import { IServiceCustomerGetByIdResponse } from './service-customer-get-by-id-response.interface';
import { IServiceCustomerSearchResponse } from './service-customer-search-response.interface';

@ApiBearerAuth()
@Controller('customer')
@ApiTags('customers')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);
  constructor(
    @Inject('CUSTOMER_SERVICE') private readonly customerService: ClientProxy,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy
  ) {}

  @Get('findAll')
  @ApiOkResponse({
    type: findAllCustomerResponseDTO,
  })
  public async findAll(
    @Query() findCustomerDTO: FindCustomerDTO
  ): Promise<findAllCustomerResponseDTO> {
    const customerResponse = await lastValueFrom(
      this.customerService.send('findAllCustomer', findCustomerDTO)
    );
    return {
      message: customerResponse.message,
      data: {
        customer: customerResponse,
      },
    };
  }
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
        customer: customerResponse.data,
      },
    };
  }
  @Get('refresh')
  @AuthorizationRefresh(true)
  async refreshTokens(@Req() req) {
    const uid = req.customer.id;
    const refreshToken = req['refreshToken'];
    console.log({ uid, refreshToken });
    return await lastValueFrom(
      this.tokenServiceClient.send('token_refresh', { uid, refreshToken })
    );

    // return this.authService.refreshTokens(userId, refreshToken);
  }
  @Post()
  // @Authorization(true)
  // @Roles(Role.Admin, Role.Employee)
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
        },
        createCustomerResponse.status
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_create', {
          uid: createCustomerResponse.data.id,
        })
      );

    return {
      message: createCustomerResponse.message,
      data: {
        customer: createCustomerResponse.data,
        token: createTokenResponse.token,
      },
    };
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: LoginCustomerResponseDto,
  })
  public async loginCustomer(
    @Body() loginRequest: LoginCustomerDto
  ): Promise<LoginCustomerResponseDto> {
    console.log({ loginRequest });

    const getCustomerResponse: IServiceCustomerSearchResponse =
      await lastValueFrom(
        this.customerService.send(
          'customer_search_by_credentials',
          loginRequest
        )
      );
    console.log(getCustomerResponse);

    if (getCustomerResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getCustomerResponse.message,
          data: null,
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_create', {
          uid: getCustomerResponse.data.id,
        })
      );
    console.log(createTokenResponse);

    return {
      message: createTokenResponse.message,
      data: {
        token: createTokenResponse.token,
        refreshToken: createTokenResponse.refreshToken,
        tokenExp: createTokenResponse.tokenExp,
        refreshTokenExp: createTokenResponse.refreshTokenExp,
      },
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
          uid: customerInfo.id,
        })
      );

    if (destroyTokenResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: destroyTokenResponse.message,
          data: null,
        },
        destroyTokenResponse.status
      );
    }

    return {
      message: destroyTokenResponse.message,
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
        },
        confirmCustomerResponse.status
      );
    }

    return {
      message: confirmCustomerResponse.message,
      data: null,
    };
  }

  @Patch('closeAccount/:id')
  @Authorization(true)
  @ApiOkResponse({})
  async closeAccount(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.customerService.send('closeAccount', id)
    );
    const response = new BaseReponse();
    response.data = result;
    return response;
  }
  @Patch(':id')
  @Authorization(true)
  @ApiOkResponse({})
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    updateCustomerDto.id = id;
    const result = await firstValueFrom(
      this.customerService.send('updateCustomer', updateCustomerDto)
    );
    const response = new BaseReponse();
    response.data = result;
    return response;
  }
}
