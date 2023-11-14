import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class CreateTransactionAbineDto {
  @ApiHideProperty()
  customerId?: string;
  @ApiProperty({
    example: '1671552887',
  })
  fromAccount: string;
  @ApiHideProperty()
  fromName?: string;
  @ApiProperty({
    example: '1234567891012',
  })
  toAccount: string;
  @ApiHideProperty()
  toName?: string;
  @ApiHideProperty()
  tellerEmpployeeId?: string;
  @ApiProperty({
    example: 50_000,
  })
  //details
  amount: number;
  @ApiProperty({
    example: 'receiver',
  })
  type: string;
  @ApiProperty({
    example: 0,
  })
  fee?: number;
  @ApiProperty({
    example: 'Tranfer description',
  })
  contentTransaction: string;
  @ApiHideProperty()
  registerDay?: Date = new Date();
  //token
  @ApiHideProperty()
  OTPToken?: string;
  @ApiHideProperty()
  OTPVerify?: boolean;
  @ApiHideProperty()
  sign?: string;
}
