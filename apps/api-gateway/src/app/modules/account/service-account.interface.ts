import { IAccount } from './account.interface';

export interface IServiceAccount {
  status: number;
  message: string;
  data: [IAccount] | null;
}
