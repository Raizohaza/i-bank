import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IDebt } from './IDebt';

export class CreateDebtDto implements IDebt {
  @ApiHideProperty()
  customerId: string;
  @ApiProperty({
    example: '1672923591502',
  })
  creditor: string;
  @ApiProperty({
    example: '1671552900',
  })
  debtor: string;
  @ApiHideProperty()
  creditorId?: string;
  @ApiHideProperty()
  debtorId?: string;
  //details
  @ApiProperty({
    example: '50000',
  })
  amount: number;
  @ApiProperty({
    example: 'Chuyển 50k',
  })
  contentDebt: string;
  //token
  @ApiHideProperty()
  OTPToken: string;
  @ApiHideProperty()
  OTPVerify: boolean;
  @ApiHideProperty()
  status: string;
}
