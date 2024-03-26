import { NextFunction } from 'express';
import { Model, Schema, model } from 'mongoose';
import { generateHash, generateSalt } from '../utils/crypto';
import {
  AUTH_PROVIDERS,
  DEFAULT_USER_APP_NAME,
  USER_ROLES,
} from '../utils/constants';

export type Provider = (typeof AUTH_PROVIDERS)[number];

export interface User extends Document {
  username: string;
  email: string;
  password?: string;
  access: (typeof USER_ROLES)[number];
  provider: Provider;
  app: string;
}

const toLowerCase = (str: string) => str.trim().toLowerCase();

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true, set: toLowerCase },
  email: { type: String, required: true, unique: true, set: toLowerCase },
  password: { type: String, required: false },
  access: { type: String, required: true, default: 'U' },
  provider: { type: String, required: true, default: 'basic' },
  app: {
    type: String,
    required: true,
    default: DEFAULT_USER_APP_NAME,
    set: toLowerCase,
  },
});

interface UserModelStatic extends Model<User> {
  comparePassword(existingPassword: string, enteredPassword: string): boolean;
}

userSchema.pre('save', async function (next: NextFunction) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = generateSalt(16, 'hex');
  const hash = generateHash(
    user.password.trim(),
    salt,
    1000,
    64,
    'sha512',
    'hex',
  );
  user.password = `${hash}.${salt}`;
  next();
});

const UserModel = model<User, UserModelStatic>('User', userSchema);

UserModel.comparePassword = (
  existingPassword: string,
  enteredPassword: string,
): boolean => {
  const [hash, salt] = existingPassword.split('.');

  const newhash = generateHash(
    enteredPassword,
    salt,
    1000,
    64,
    'sha512',
    'hex',
  );
  return hash === newhash;
};

export default UserModel;
