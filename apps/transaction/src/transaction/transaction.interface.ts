export interface ITransaction {
  customerId: string;
  fromAccount: string;
  fromName: string;
  toAccount: string;
  toName: string;
  tellerEmpployeeId?: string;
  amount: number;
  type: string;
  transTime?: Date;
  fee?: number;
  contentTransaction: string;
  registerDay?: Date;
  OTPToken?: string;
  OTPVerify?: boolean;
}
