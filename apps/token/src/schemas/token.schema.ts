import * as mongoose from 'mongoose';

function transformValue(doc, ret: { [key: string]: unknown }) {
  delete ret._id;
}

export const TokenSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, 'id can not be empty'],
    },
    token: {
      type: String,
      required: [true, 'Token can not be empty'],
    },
    refreshToken: {
      type: String,
      // required: [true, 'Refresh token can not be empty'],
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
