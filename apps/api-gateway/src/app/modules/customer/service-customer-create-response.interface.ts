import { ICustomer } from './customer.interface';

export interface IServiceCustomerCreateResponse {
  status: number;
  message: string;
  customer: ICustomer | null;
  errors: { [key: string]: unknown };
}
