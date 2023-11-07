import { Controller, Logger, HttpStatus } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ParseObjectIdPipe } from '../pipes/ObjectId.pipe';
import { CreateAccountDto } from './dto/create-account.dto';
@Controller()
export class AccountController {
  private readonly logger: Logger = new Logger(AccountController.name);
  constructor(private readonly accountService: AccountService) {}
  @MessagePattern('account_create')
  async create(@Payload() createAccountDto: CreateAccountDto) {
    const result = await this.accountService
      .create(createAccountDto)
      .catch((e) => {
        return {
          message: e.message,
          errors: e.errors,
        };
      });
    if (result?.errors) {
      return { status: HttpStatus.BAD_REQUEST, message: result['message'] };
    }
    return { status: HttpStatus.OK, message: 'Sucessed', data: result };
  }

  @MessagePattern('account_get_all')
  findAll() {
    return this.accountService.findAll();
  }
  @MessagePattern('account_get_by_user_id')
  async findByUser(@Payload() id: string) {
    const accounts = await this.accountService.findByUser(id);
    return {
      status: HttpStatus.OK,
      message: 'Sucessed',
      data: accounts,
    };
  }
  @MessagePattern('findOneAccount')
  @UsePipes(new ParseObjectIdPipe())
  findOne(@Payload() id: string) {
    return this.accountService.findOne(id);
  }

  @MessagePattern('remoteFindById')
  @UsePipes(new ParseObjectIdPipe())
  remoteFindById(@Payload() id: string) {
    return this.accountService.remoteFindById(id);
  }

  @MessagePattern('remoteFindByAccountNumber')
  remoteFindByAccountNumber(@Payload() accountNum: string) {
    return this.accountService.remoteFindByAccountNumber(accountNum);
  }
  @MessagePattern('updateAccount')
  async update(@Payload() updateAccountDto: UpdateAccountDto) {
    const result = await this.accountService.update(
      updateAccountDto.id,
      updateAccountDto
    );
    return result;
  }

  @MessagePattern('removeAccount')
  async remove(@Payload() id: string) {
    return await this.accountService.remove(id);
  }
}
