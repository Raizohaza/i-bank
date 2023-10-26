import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Authorization } from './decorators/authorization.decorator';
import { CreateAccountReponseDto } from './interfaces/account/dto/create-account-reponse.dto';
import { CreateAccountDto } from './interfaces/account/dto/create-account.dto';
import { GetByUserIdResponse } from './interfaces/account/dto/get-account-by-user-id.dto';
import { IServiceAccount } from './interfaces/account/service-account.interface';
import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
@ApiBearerAuth()
@Controller('acount')
@ApiTags('acounts')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly accountService: ClientProxy
  ) {}

  @Get()
  @Authorization(true)
  @ApiOkResponse({
    type: GetByUserIdResponse,
  })
  async GetByUserId(
    @Req() request: IAuthorizedRequest
  ): Promise<GetByUserIdResponse> {
    const customer = request.customer;
    const accountResponse: IServiceAccount = await firstValueFrom(
      this.accountService.send('account_get_by_user_id', customer.id)
    );
    return <GetByUserIdResponse>{
      status: accountResponse.status,
      message: accountResponse.message,
      data: accountResponse.data,
    };
  }
  @Post()
  @Authorization(true)
  @ApiOkResponse({
    type: CreateAccountReponseDto,
  })
  async CreateAccount(
    @Body() body: CreateAccountDto,
    @Req() request: IAuthorizedRequest
  ): Promise<CreateAccountReponseDto> {
    body.customerId = request.customer.id;
    const accountResponse: IServiceAccount = await firstValueFrom(
      this.accountService.send('account_create', body)
    );

    return <CreateAccountReponseDto>{
      message: accountResponse.message,
      data: accountResponse.data,
    };
  }
}
