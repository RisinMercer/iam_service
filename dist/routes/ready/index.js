"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const handlers_1 = require("../../handlers");
const constants_1 = require("../../utils/constants");
const readyRouter = express.Router({ mergeParams: true });
readyRouter.route(`${constants_1.BASIC_READY_ROUTE}`).get(handlers_1.ReadyService.get);
exports.default = readyRouter;
//# sourceMappingURL=index.js.map