import * as express from 'express';
import { Router } from 'express';
import { AuthRouter } from '../../handlers';
import { BASIC_AUTH_ROUTE } from '../../utils/constants';

const authRoutes: Router = express.Router({ mergeParams: true });

/** signup routes */
authRoutes
  .route(`${BASIC_AUTH_ROUTE}`)
  .post(AuthRouter.authService.signup.post);
authRoutes
  .route(`${BASIC_AUTH_ROUTE}/basic/redirect`)
  .post(AuthRouter.basicAuthService.signup.post);

/** login routes */
authRoutes
  .route(`${BASIC_AUTH_ROUTE}/login`)
  .post(AuthRouter.authService.login.post);
authRoutes
  .route(`${BASIC_AUTH_ROUTE}/login/basic/redirect`)
  .post(AuthRouter.basicAuthService.login.post);

export default authRoutes;
