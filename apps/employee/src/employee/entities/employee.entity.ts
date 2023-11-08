import mongoose from 'mongoose';

export interface IEmployeeSchema extends mongoose.Document {
  name: string;
  position: string;
  phone: string;
  login: string;
  password: string;
  email: string;
}
export const EmployeeSchema = new mongoose.Schema<IEmployeeSchema>({
  name: String,
  position: { type: String, required: false },
  phone: { type: String, required: true },
  login: { type: String, required: false },
  password: { type: String, required: true },
  email: { type: String, required: true },
});
