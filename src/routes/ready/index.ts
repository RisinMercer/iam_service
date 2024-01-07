import * as express from 'express';
import { Router } from 'express';
import { ReadyService } from '../../handlers';

const readyRouter: Router = express.Router({ mergeParams: true });

readyRouter.route('/ready').get(ReadyService.get);

export default readyRouter;
