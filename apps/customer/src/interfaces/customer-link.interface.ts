import { Document } from 'mongoose';

export interface ICustomerLink extends Document {
  id?: string;
  customer_id: string;
  link: string;
  is_used: boolean;
}
