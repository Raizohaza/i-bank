import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IReceiver } from '../entities/receiver.entity';

export class CreateReceiverDto implements IReceiver {
  @ApiProperty({
    uniqueItems: true,
    example: '1234567891012',
  })
  accountNumber: string;
  @ApiProperty({
    example: 'Ga Con',
  })
  remindName: string;
  @ApiHideProperty()
  customerId: string;
}
