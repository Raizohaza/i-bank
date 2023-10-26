import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: unknown }) {
  delete ret._id;
}

function generateLink() {
  return Math.random().toString(36).replace('0.', '');
}

export const CustomerLinkSchema = new mongoose.Schema(
  {
    customer_id: {
      type: String,
      required: [true, 'Customer can not be empty'],
    },
    is_used: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: generateLink(),
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
  }
);
