import { ICustomer } from './customer.interface';

export interface ICustomerCreateResponse {
  status: number;
  message: string;
  customer: ICustomer | null;
  errors: { [key: string]: unknown } | null;
}
