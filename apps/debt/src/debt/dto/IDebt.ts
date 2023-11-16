export interface IDebt {
  //basic info
  customerId: string;
  creditor: string;
  debtor: string;
  creditorId: string;
  debtorId: string;
  //details
  amount: number;
  type: string;
  contentDebt: string;
  cancelReason?: string;
  //token
  status: string;
  transId?: string;
}
