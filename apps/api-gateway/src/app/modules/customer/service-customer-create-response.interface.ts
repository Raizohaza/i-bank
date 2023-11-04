import { ICustomer } from './customer.interface';

export interface IServiceCustomerCreateResponse {
  status: number;
  message: string;
  data: ICustomer | null;
}
