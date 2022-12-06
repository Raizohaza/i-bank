import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: unknown }) {
  delete ret._id;
}

export const TokenSchema = new mongoose.Schema(
  {
    customer_id: {
      type: String,
      required: [true, 'Customer can not be empty'],
    },
    token: {
      type: String,
      required: [true, 'Token can not be empty'],
    },
  },
  {
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
  },
);