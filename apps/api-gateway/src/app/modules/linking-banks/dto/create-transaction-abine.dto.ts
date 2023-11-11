import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionAbineDto {
  customerId?: string;
  @ApiProperty({
    example: '1671552887',
  })
  fromAccount: string;
  fromName?: string;
  @ApiProperty({
    example: '1234567891012',
  })
  toAccount: string;
  toName?: string;
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

  registerDay?: Date = new Date();
  //token
  OTPToken?: string;
  OTPVerify?: boolean;
  sign?: string;
}
