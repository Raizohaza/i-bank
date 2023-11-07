import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateLinkingBankDto } from './dto/create-linking-bank.dto';
import { UpdateLinkingBankDto } from './dto/update-linking-bank.dto';

@Injectable()
export class LinkingBankService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy,
    @Inject('ACCOUNT_SERVICE')
    private readonly accountService: ClientProxy
  ) {}
  create(createLinkingBankDto: CreateLinkingBankDto) {
    return 'This action adds a new linkingBank';
  }
  createTransfer(createLinkingBankDto: CreateLinkingBankDto) {
    console.log(createLinkingBankDto);
    return 'This action create transfer';
  }

  findAll() {
    return `This action returns all linkingBank`;
  }

  async findOne(id: string) {
    return await lastValueFrom(
      this.accountService.send('remoteFindByAccountNumber', id)
    );
  }

  update(id: string, updateLinkingBankDto: UpdateLinkingBankDto) {
    return `This action updates a #${id} linkingBank`;
  }

  remove(id: string) {
    return `This action removes a #${id} linkingBank`;
  }
}
