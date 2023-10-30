import { ICustomer } from './customer.interface';

export interface IServiceCustomerSearchResponse {
  status: number;
  message: string;
  customer: ICustomer | null;
}
