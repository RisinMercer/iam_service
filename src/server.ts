import * as cors from 'cors';
import * as express from 'express';
import { errorHandler } from './handlers/error';
import { buildRoutes, initializeServer } from './utils';

const app: express.Express = express();
const corsOptions: cors.CorsOptions = {
  origin: ['*'],
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(errorHandler);

/** Building all the routes */
buildRoutes(app);

/** Initializing Server with MongoDB */
initializeServer(app);

module.exports = app;
