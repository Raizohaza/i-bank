import mongoose from 'mongoose';

export interface IEmployeeSchema extends mongoose.Document {
  name: string;
  position: string;
  phone: string;
  login: string;
  password: string;
}
export const EmployeeSchema = new mongoose.Schema<IEmployeeSchema>({
  name: String,
  position: String,
  phone: String,
  login: String,
  password: String,
});
