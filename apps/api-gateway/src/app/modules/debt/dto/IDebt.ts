export interface IDebt {
  //basic info
  customerId: string;
  creditor: string;
  debtor: string;
  //details
  amount: number;
  contentDebt: string;
  //token
  OTPToken: string;
  OTPVerify: boolean;
  status: string;
}
