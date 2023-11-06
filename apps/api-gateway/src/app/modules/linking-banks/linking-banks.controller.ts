import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateLinkingBankDto } from './dto/create-linking-bank.dto';
import { UpdateLinkingBankDto } from './dto/update-linking-bank.dto';
import { Inject } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBasicAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  Authorization,
  BasicAuthorization,
} from '../../decorators/authorization.decorator';
import { lastValueFrom } from 'rxjs';
import { createKey, decrypt, encrypt } from '../../utils/rsa.encrypt';
@ApiHeader({ name: 'x-api-key' })
@ApiHeader({ name: 'x-time' })
@ApiTags('linking-banks')
@Controller('linking-banks')
export class LinkingBanksController {
  constructor(
    @Inject('LINKING_BANKS_SERVICE')
    private readonly linkingBanksService: ClientProxy
  ) {}

  // @Post()
  // @Authorization(true)
  // create(@Body() createLinkingBankDto: CreateLinkingBankDto) {
  //   return lastValueFrom(this.linkingBanksService.send('findAllBanks', {}));
  // }
  @Post()
  @Authorization(true)
  createTransfer(@Body() createLinkingBankDto: CreateLinkingBankDto) {
    return lastValueFrom(
      this.linkingBanksService.send('createTransfer', createLinkingBankDto)
    );
  }
  // @Get()
  // @Authorization(true)
  // findAll() {
  //   return lastValueFrom(this.linkingBanksService.send('findAllBanks', {}));
  // }

  @Get('account/:accountNum')
  @BasicAuthorization(true)
  findOne(@Param('accountNum') accountNum: string) {
    return lastValueFrom(
      this.linkingBanksService.send('remoteFindByAccountNumber', accountNum)
    );
  }
  @Get('rsa/generateKey')
  generateKey() {
    createKey();
  }

  @Get('rsa/encrypt')
  encrypt() {
    return encrypt({ message: 'hi mom' });
  }
  @Post('rsa/decrypt')
  decrypt(@Body() body: { message: string }) {
    return decrypt(body.message);
  }
}
