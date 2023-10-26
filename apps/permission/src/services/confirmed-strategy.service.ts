import { IPermissionStrategy } from '../interfaces/permission-strategy.interface';
import { ICustomer } from '../interfaces/customer.interface';
import { permissions as forbiddenPermissionsConstants } from '../constants/permissions';
export class ConfirmedStrategyService implements IPermissionStrategy {
  public getAllowedPermissions(
    customer: ICustomer,
    permissions: string[],
  ): string[] {
    const forbiddenPermissions = forbiddenPermissionsConstants;
    return customer.is_confirmed
      ? permissions
      : permissions.filter((permission: string) => {
          return !forbiddenPermissions.includes(permission);
        });
  }
}
