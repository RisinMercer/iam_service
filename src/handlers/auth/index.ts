import { NextFunction, Request, Response } from 'express';
import { UserSession } from '../../models/dtos/UserSession';
import UserModel, { Provider, User } from '../../models/users';
import { GenericError, ResponseObject, setUserToSession } from '../../utils';
import {
  AUTH_PROVIDERS,
  BASIC_AUTH_ROUTE,
  BASIC_ROUTE,
  DEFAULT_USER_APP_NAME,
} from '../../utils/constants';
import { validateBasicAuthBody } from './validations';

const authService = {
  signup: {
    post: (req: Request, res: Response, next: NextFunction) => {
      try {
        const provider: Provider = req.query.provider as Provider;
        if (AUTH_PROVIDERS.includes(provider))
          return res.redirect(
            307,
            `${BASIC_ROUTE}/${BASIC_AUTH_ROUTE}/${provider}/redirect`,
          );
        const error: GenericError = new Error('Provider not available');
        error.status = 400;
        throw error;
      } catch (error) {
        console.log('Mercer -> error : ', error);
        next(error);
      }
    },
  },
  login: {
    post: (req: Request, res: Response, next: NextFunction) => {
      try {
        const provider: Provider = req.query.provider as Provider;
        if (AUTH_PROVIDERS.includes(provider))
          return res.redirect(
            307,
            `${BASIC_ROUTE}/${BASIC_AUTH_ROUTE}/login/${provider}/redirect`,
          );
        const error: GenericError = new Error('Provider not available');
        error.status = 400;
        throw error;
      } catch (error) {
        console.log('Mercer -> error : ', error);
        next(error);
      }
    },
  },
};

const basicAuthService = {
  signup: {
    post: async (req: Request, res: Response, next: NextFunction) => {
      try {
        let {
          username,
          email,
          password,
          app = DEFAULT_USER_APP_NAME,
        } = req.body;
        /** for testing puspose, delete all users, then create new ones */
        // await UserModel.deleteMany({});
        const statusMessageResponse = await validateBasicAuthBody(
          username,
          email,
          password,
          app,
        );
        if (!statusMessageResponse.getStatus()) {
          throw new Error(statusMessageResponse.getMessage());
        } else {
          console.log('Mercer -> username : ', username);
          console.log('Mercer -> app : ', app);
          const user: User = await UserModel.create({
            username,
            email,
            password,
            provider: 'basic',
            app,
          });
          const userSession: UserSession = req.session;
          setUserToSession(user, userSession);
          return new ResponseObject(res, 201, user).build();
        }
      } catch (error) {
        next(error);
      }
    },
  },
  login: {
    post: async (req: Request, res: Response, next: NextFunction) => {
      try {
        let {
          username,
          password,
          app = DEFAULT_USER_APP_NAME,
        }: {
          username?: string;
          password?: string;
          app: string;
        } = req.body;
        if (username?.trim() && password?.trim()) {
          console.log('Mercer -> username : ', username);
          const user: User = await UserModel.findOne({ username, app });
          if (user) {
            const isPasswordValid = UserModel.comparePassword(
              user.password,
              password,
            );
            if (isPasswordValid) {
              const userSession: UserSession = req.session;
              setUserToSession(user, userSession);
              return new ResponseObject(res, 201, user).build();
            }
            const error: GenericError = new Error('Password is invalid');
            error.status = 401;
            throw error;
          }
          const error: GenericError = new Error(
            'User with given username does not exists',
          );
          error.status = 401;
          throw error;
        }
        const error: GenericError = new Error('Invalid username or password');
        error.status = 400;
        throw error;
      } catch (error) {
        next(error);
      }
    },
  },
};

export default {
  authService,
  basicAuthService,
};
