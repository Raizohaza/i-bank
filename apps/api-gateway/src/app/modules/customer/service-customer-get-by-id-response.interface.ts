import { ICustomer } from './customer.interface';

export interface IServiceCustomerGetByIdResponse {
  status: number;
  message: string;
  customer: ICustomer | null;
}
