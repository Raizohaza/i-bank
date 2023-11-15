import { PartialType } from '@nestjs/mapped-types';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CreateDebtDto } from './create-debt.dto';

export class CancelDebtDto extends PartialType(CreateDebtDto) {
  @ApiHideProperty()
  id: string;
  @ApiProperty({
    example: 'Already paid',
  })
  cancelReason: string;
}
