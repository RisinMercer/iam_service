import { ErrorRequestHandler } from 'express';
import { GenericError } from '../utils';

export const errorHandler: ErrorRequestHandler = (
  error: GenericError,
  req,
  res,
  next,
) =>
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Oops! Something went wrong',
    },
  });
