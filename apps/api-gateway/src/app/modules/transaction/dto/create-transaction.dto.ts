import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    example: '638f00e407c33e2de2948525',
  })
  customerId: string;
  @ApiProperty({
    example: '638f00e407c33e2de2948525',
  })
  fromAccount: string;
  @ApiHideProperty()
  fromName?: string;
  @ApiProperty({
    example: '6390aba8cbca1ab1879a96d8',
  })
  toAccount: string;
  toName: string;
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
    example: new Date(),
  })
  transTime?: Date;
  @ApiProperty({
    example: 0,
  })
  fee?: number;
  @ApiProperty({
    example: 'Tranfer desctiption',
  })
  contentTransaction: string;
  @ApiHideProperty()
  OTPToken: string;
  @ApiHideProperty()
  OTPVerify: boolean;
}
