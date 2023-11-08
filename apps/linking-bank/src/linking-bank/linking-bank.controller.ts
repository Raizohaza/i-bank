import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LinkingBankService } from './linking-bank.service';
import { CreateLinkingBankDto } from './dto/create-linking-bank.dto';
import { UpdateLinkingBankDto } from './dto/update-linking-bank.dto';

@Controller()
export class LinkingBankController {
  constructor(private readonly linkingBankService: LinkingBankService) {}

  @MessagePattern('createLinkingBank')
  create(@Payload() createLinkingBankDto: CreateLinkingBankDto) {
    return this.linkingBankService.create(createLinkingBankDto);
  }

  @MessagePattern('createTransfer')
  createTransfer(@Payload() createLinkingBankDto: CreateLinkingBankDto) {
    return this.linkingBankService.createTransfer(createLinkingBankDto);
  }

  @MessagePattern('findAllLinkingBank')
  findAll() {
    return this.linkingBankService.findAll();
  }

  @MessagePattern('remoteFindByAccountNumber')
  findOne(@Payload() id: string) {
    const findOneLinkBank =  this.linkingBankService.findOne(id);
    console.log(findOneLinkBank);
    return findOneLinkBank;
  }

  @MessagePattern('updateLinkingBank')
  update(@Payload() updateLinkingBankDto: UpdateLinkingBankDto) {
    return this.linkingBankService.update(
      updateLinkingBankDto.id,
      updateLinkingBankDto
    );
  }

  @MessagePattern('removeLinkingBank')
  remove(@Payload() id: string) {
    return this.linkingBankService.remove(id);
  }
}
