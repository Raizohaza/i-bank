import { IPermissionStrategy } from '../interfaces/permission-strategy.interface';
import { IUser } from '../interfaces/user.interface';
import { permissions as forbiddenPermissionsConstants } from '../constants/permissions';
export class ConfirmedStrategyService implements IPermissionStrategy {
  public getAllowedPermissions(user: IUser, permissions: string[]): string[] {
    const forbiddenPermissions = forbiddenPermissionsConstants;
    return user.is_confirmed
      ? permissions
      : permissions.filter((permission: string) => {
          return !forbiddenPermissions.includes(permission);
        });
  }
}
