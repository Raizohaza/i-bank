import { ICustomer } from '../customer/customer.interface';

export interface IAuthorizedRequest extends Request {
  customer?: ICustomer;
}
