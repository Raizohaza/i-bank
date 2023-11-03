import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    example: '638f00e407c33e2de2948525',
  })
  customerId: string;
  @ApiProperty({
    example: '6390aba8cbca1ab1879a96d8',
  })
  fromAccount: string;
  @ApiProperty({
    example: 'A',
  })
  fromName: string;
  @ApiProperty({
    example: '638f00e407c33e2de2948525',
  })
  toAccount: string;
  @ApiProperty({
    example: 'B',
  })
  toName: string;
  @ApiProperty({
    example: 'ObjectIdEmp',
  })
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
  @ApiProperty({
    example: new Date(),
  })
  registerDay?: Date;
  @ApiProperty({
    example: 'ObjectId',
  })
  //token
  OTPToken?: string;
  @ApiProperty({
    example: 'ObjectId',
  })
  OTPVerify?: boolean;
}
