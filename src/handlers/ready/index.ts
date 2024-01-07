import { NextFunction, Request, Response } from 'express';
import { ResponseObject } from '../../utils';

const readyService = {
  get: (req: Request, res: Response, next: NextFunction) => {
    try {
      return new ResponseObject(res, 200, {
        message: 'Hey there!! You are using IAM Service',
      }).build();
    } catch (error) {
      return next(error);
    }
  },
};

export default readyService;
