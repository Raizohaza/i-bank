import { SetMetadata } from '@nestjs/common';

export const Authorization = (secured: boolean) =>
  SetMetadata('secured', secured);

export const AuthorizationRefresh = (secured: boolean) =>
  SetMetadata('securedRefresh', secured);

export const BasicAuthorization = (secured: boolean) =>
  SetMetadata('basicSecured', secured);
