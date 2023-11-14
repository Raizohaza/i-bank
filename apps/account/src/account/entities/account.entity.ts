import mongoose, { ObjectId } from 'mongoose';
function transformValue(doc, ret: { [key: string]: unknown }) {
  delete ret._id;
  delete ret.password;
}

export interface IAccountSchema extends mongoose.Document {
  customerId: ObjectId;
  type: string;
  balance: number;
  accountNumber: string;
  status: string;
}
export const AccountSchema = new mongoose.Schema<IAccountSchema>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    type: {
      type: String,
      enum: ['PAYROLL', 'SAVING'],
    },
    accountNumber: { type: String, required: true },
    balance: Number,
    status: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'INACTIVE'],
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  }
);
