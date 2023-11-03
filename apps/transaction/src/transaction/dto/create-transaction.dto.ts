export class CreateTransactionDto {
  customerId: string;
  fromAccount: string;
  fromName: string;
  toAccount: string;
  toName: string;
  tellerEmpployeeId: string;
  //details
  amount: number;
  type: string;
  transTime: Date;
  fee: number;
  contentTransaction: string;
  registerDay: Date;
  //token
  OTPToken: string;
  OTPVerify: boolean;
}
