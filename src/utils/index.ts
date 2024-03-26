import { CookieOptions, Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAM_SERVICE_PORT, MONGODB_URL } from '../config';
import { authMiddleware } from '../middlewares';
import { UserSession } from '../models/dtos/UserSession';
import { User } from '../models/users';
import { AuthRouter, ReadyRouter } from '../routes';
import { BASIC_READY_ROUTE, BASIC_ROUTE } from './constants';

export class ResponseObject {
  private response: Response;
  private status: number;
  private body?: any;

  constructor(response: Response, status: number, body?: any) {
    this.response = response;
    this.status = status;
    this.body = body;
  }

  public build = () => {
    return this.response.status(this.status).json(this.body || {});
  };

  public cookie = (
    cookieName: string,
    cookieValue: any,
    options: CookieOptions,
  ) => {
    this.response.cookie(cookieName, cookieValue, options);
    return this;
  };
}

export class StatusMessageResponse {
  private status: boolean;
  private message: string;

  constructor(status: boolean, message: string) {
    this.status = status ?? false;
    this.message = message ?? 'Exception Occured';
  }

  public getStatus = (): boolean => this.status;
  public getMessage = (): string => this.message;
}

export class GenericResponse<T> {
  private status: boolean;
  private message: string;
  private data: T;

  public getStatus = (): boolean => this.status;
  public getMessage = (): string => this.message;
  public getData = (): T => this.data;
}

export interface GenericError extends Error {
  status?: number;
}

export const isJsonString = (str: string | null | undefined): boolean => {
  try {
    return !!(JSON.parse(str) && str);
  } catch (error) {
    return false;
  }
};

export function setUserToSession(user: User, session: UserSession) {
  if (user && session) {
    session.user = user;
  } else {
    const error: GenericError = new Error('Unable to set user to session');
    throw error;
  }
}

export const initializeServer = (app: Express): void => {
  mongoose.set('debug', true);
  mongoose.Promise = Promise;
  mongoose
    .connect(MONGODB_URL)
    .then(() =>
      app.listen(IAM_SERVICE_PORT, () => {
        console.log(`[Server]: IAM running at PORT ${IAM_SERVICE_PORT}`);
      }),
    )
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
};

export const buildRoutes = (app: Express): void => {
  /** Middlewares */
  app.use(authMiddleware);

  /** Custom Routes */
  app.use(BASIC_ROUTE, ReadyRouter);
  app.use(BASIC_ROUTE, AuthRouter);

  /** Default Route */
  app.get('/*', (req: Request, res: Response) => {
    res.redirect(`${BASIC_ROUTE}${BASIC_READY_ROUTE}`);
  });
};
