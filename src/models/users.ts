import { Schema, model } from 'mongoose';

interface Users {
  username: string;
  email: string;
  access: 'U' | 'A' | 'O'; //User, Admin, Owner
}

const userSchema = new Schema<Users>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  access: { type: String, required: true, default: 'U' },
});

const UserModel = model<Users>('User', userSchema);

export default UserModel;
