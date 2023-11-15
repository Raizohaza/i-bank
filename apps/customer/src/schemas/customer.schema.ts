import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

function transformValue(doc, ret: { [key: string]: unknown }) {
  delete ret._id;
  delete ret.password;
}

export interface ICustomerSchema extends mongoose.Document {
  email: string;
  password: string;
  is_confirmed: boolean;
  type: string;
  name: string;
  status: string;
  comparePassword: (password: string) => Promise<boolean>;
  getEncryptedPassword: (password: string) => Promise<string>;
}

export const CustomerSchema = new mongoose.Schema<ICustomerSchema>(
  {
    email: {
      type: String,
      required: [true, 'Email can not be empty'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email should be valid',
      ],
    },
    name: {
      type: String,
      required: [true, 'Name can not be empty'],
    },
    is_confirmed: {
      type: Boolean,
      required: [true, 'Confirmed can not be empty'],
    },
    password: {
      type: String,
      required: [true, 'Password can not be empty'],
      minlength: [6, 'Password should include at least 6 chars'],
    },
    type: {
      type: String,
      default: 'customer',
    },
    status: {
      type: String,
      default: 'ACTIVE',
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

CustomerSchema.methods.getEncryptedPassword = (
  password: string
): Promise<string> => {
  return bcrypt.hash(String(password), SALT_ROUNDS);
};

CustomerSchema.methods.compareEncryptedPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await this.getEncryptedPassword(this.password);
  next();
});
