export interface IAccount extends Document {
  customerId: string;
  type: string;
  balance: number;
  accountNumber: string;
}
