import { RequestHandler } from 'express';
import { UserSession } from '../models/dtos/UserSession';
import { ResponseObject } from '../utils';

const whiteListedUrls = new Map<string, boolean>([
  // ['/iam/ready', true],
  ['/iam/auth', true],
  ['/iam/auth/login', true],
  ['/iam//auth/basic/redirect', true],
  ['/iam//auth/login/basic/redirect', true],
]);

const authenticationHandler: RequestHandler = (req, res, next) => {
  /**
   * TODO need to come up with better logic
   */
  if (whiteListedUrls.has(req.path?.toLowerCase() || '')) return next();
  const userSession: UserSession = req.session;
  if (userSession.user) return next();

  return new ResponseObject(res, 401, {
    message: 'Full authentication is required to access this resource',
  }).build();
};

export default authenticationHandler;
