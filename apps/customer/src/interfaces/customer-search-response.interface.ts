import { ICustomer } from './customer.interface';

export interface ICustomerSearchResponse {
  status: number;
  message: string;
  data: ICustomer | null;
}
