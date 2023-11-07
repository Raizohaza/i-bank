import { ICustomer } from './customer.interface';

export interface ICustomerCreateResponse {
  status: number;
  message: string;
  data: ICustomer | null;
}
