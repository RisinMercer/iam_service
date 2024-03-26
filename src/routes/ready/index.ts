import * as express from 'express';
import { Router } from 'express';
import { ReadyService } from '../../handlers';
import { BASIC_READY_ROUTE } from '../../utils/constants';

const readyRouter: Router = express.Router({ mergeParams: true });

readyRouter.route(`${BASIC_READY_ROUTE}`).get(ReadyService.get);

export default readyRouter;
