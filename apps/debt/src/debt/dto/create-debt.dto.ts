import { IDebt } from './IDebt';

export class CreateDebtDto implements IDebt {
  customerId: string;
  creditor: string;
  debtor: string;
  //details
  amount: number;
  type: string;
  contentDebt: string;
  //token
  OTPToken: string;
  OTPVerify: boolean;
  status: string;
  creditorId: string;
  debtorId: string;
}
