import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
export class FindAllDTO {
  @ApiProperty({
    required: false,
    default: 'iBank',
    enum: ['iBank', 'Abine'],
  })
  bank: string;

  @ApiProperty({
    required: false,
    default: moment().startOf('day'),
  })
  from: Date;
  @ApiProperty({
    required: false,
    default: moment().endOf('day'),
  })
  to: Date;
}
