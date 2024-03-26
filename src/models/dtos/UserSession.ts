import { SessionData } from 'express-session';
import { User } from '../users';

export type UserSession = SessionData & {
  user?: User;
};
