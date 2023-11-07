import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkingBankDto } from './create-linking-bank.dto';

export class UpdateLinkingBankDto extends PartialType(CreateLinkingBankDto) {
  id: string;
}
