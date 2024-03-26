import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import { errorHandler } from './handlers/error';
import { GenericError, buildRoutes, initializeServer } from './utils';

const app: express.Express = express();
const corsOptions: cors.CorsOptions = {
  origin: ['*'],
};
const cookieOptions: session.CookieOptions = {
  maxAge: 1000 * 60,
};
const sessionOptions: session.SessionOptions = {
  secret: 'hello world',
  saveUninitialized: false,
  resave: false,
  cookie: cookieOptions,
};

app.use(express.json());
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

/** Building all the routes */
buildRoutes(app);

app.use(function (req, res, next) {
  let err: GenericError = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(errorHandler);

/** Initializing Server with MongoDB */
initializeServer(app);

module.exports = app;
