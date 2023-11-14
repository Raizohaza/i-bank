import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IReceiver } from '../entities/receiver.entity';

export class CreateReceiverByAccountNumberDto implements IReceiver {
  @ApiHideProperty()
  accountId: string;
  @ApiProperty({
    uniqueItems: true,
    example: '1671552900',
  })
  accountNumber: string;
  @ApiProperty({
    example: 'userA',
  })
  remindName: string;
  @ApiHideProperty()
  customerId: string;
}
