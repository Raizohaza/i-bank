import { ICustomer } from './customer.interface';

export interface IServiceCustomerSearchResponse {
  status: number;
  message: string;
  data: ICustomer | null;
}
