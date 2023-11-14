import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';

export class FindAllDTO extends PartialType(CreateTransactionDto) {
  @ApiProperty({
    required: false,
    default: 'iBank',
    enum: ['iBank', 'Abine'],
  })
  bank: string;

  @ApiProperty({
    required: false,
    default: Date.now(),
    enum: ['iBank', 'Abine'],
  })
  from: Date;
  @ApiProperty({
    required: false,
    default: Date.now(),
  })
  to: Date;
}
