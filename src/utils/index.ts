import { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IAM_SERVICE_PORT, MONGODB_URL } from '../config';
import { ReadyRouter } from '../routes';

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
}

export const isJsonString = (str: string | null | undefined): boolean => {
  try {
    return !!(JSON.parse(str) && str);
  } catch (error) {
    return false;
  }
};

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
  /** Custom Routes */
  app.use('/iam', ReadyRouter);

  /** Default Route */
  app.get('/*', (req: Request, res: Response) => {
    res.redirect('/iam/ready');
  });
};
