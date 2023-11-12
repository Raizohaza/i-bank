import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IReceiver } from '../entities/receiver.entity';

export class CreateReceiverDto implements IReceiver {
  @ApiProperty({
    uniqueItems: true,
    example: 'ObjectId',
  })
  accountId: string;
  @ApiProperty({
    example: 'userA',
  })
  remindName: string;
  @ApiHideProperty()
  customerId: string;
}
