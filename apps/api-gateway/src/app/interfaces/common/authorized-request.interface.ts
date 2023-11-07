import { ICustomer } from '../../modules/customer';

export interface IAuthorizedRequest extends Request {
  customer?: ICustomer;
}
