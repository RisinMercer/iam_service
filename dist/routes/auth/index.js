"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const handlers_1 = require("../../handlers");
const constants_1 = require("../../utils/constants");
const authRoutes = express.Router({ mergeParams: true });
/** signup routes */
authRoutes
    .route(`${constants_1.BASIC_AUTH_ROUTE}`)
    .post(handlers_1.AuthRouter.authService.signup.post);
authRoutes
    .route(`${constants_1.BASIC_AUTH_ROUTE}/basic/redirect`)
    .post(handlers_1.AuthRouter.basicAuthService.signup.post);
/** login routes */
authRoutes
    .route(`${constants_1.BASIC_AUTH_ROUTE}/login`)
    .post(handlers_1.AuthRouter.authService.login.post);
authRoutes
    .route(`${constants_1.BASIC_AUTH_ROUTE}/login/basic/redirect`)
    .post(handlers_1.AuthRouter.basicAuthService.login.post);
exports.default = authRoutes;
//# sourceMappingURL=index.js.map