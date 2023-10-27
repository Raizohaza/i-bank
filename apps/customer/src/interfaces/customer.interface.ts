import { Document } from 'mongoose';

export interface ICustomer extends Document {
  id?: string;
  email: string;
  name: string;
  password: string;
  is_confirmed: boolean;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}
