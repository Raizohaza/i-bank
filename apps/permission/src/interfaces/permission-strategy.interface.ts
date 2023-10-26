import { ICustomer } from './customer.interface';

export interface IPermissionStrategy {
  getAllowedPermissions: (
    customer: ICustomer,
    permissions: string[],
  ) => string[];
}
