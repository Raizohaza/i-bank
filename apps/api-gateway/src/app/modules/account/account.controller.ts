import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Req,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Authorization } from '../../decorators/authorization.decorator';
import { CreateAccountReponseDto } from './dto/create-account-reponse.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetByUserIdResponse } from './dto/get-account-by-user-id.dto';
import { UpdateAccountReponseDto } from './dto/update-account-reponse.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IServiceAccount } from './service-account.interface';
import { IAuthorizedRequest } from '../../interfaces/common/authorized-request.interface';
import { BaseReponse } from '../../interfaces/common/base-reponse.dto';
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
  @Patch(':id')
  @Authorization(true)
  @ApiOkResponse({
    type: CreateAccountReponseDto,
  })
  async UpdateAccount(
    @Body() body: UpdateAccountDto,
    @Req() request: IAuthorizedRequest,
    @Param('id') id: string
  ): Promise<UpdateAccountReponseDto> {
    body.id = id;
    const accountResponse: IServiceAccount = await firstValueFrom(
      this.accountService.send('updateAccount', body)
    );
    console.log(accountResponse);
    return <UpdateAccountReponseDto>{
      message: accountResponse.message,
      data: accountResponse.data,
    };
  }
  @Delete(':id')
  @Authorization(true)
  @ApiOkResponse({
    type: BaseReponse,
  })
  async DeleteAccount(
    @Req() request: IAuthorizedRequest,
    @Param('id') id: string
  ): Promise<unknown> {
    const accountId = id;
    const accountResponse: IServiceAccount = await firstValueFrom(
      this.accountService.send('removeAccount', accountId)
    );

    return <BaseReponse>{
      message: accountResponse.message,
    };
  }
}
