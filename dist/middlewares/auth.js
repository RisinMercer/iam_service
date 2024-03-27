"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const whiteListedUrls = new Map([
    // ['/iam/ready', true],
    ['/iam/auth', true],
    ['/iam/auth/login', true],
    ['/iam//auth/basic/redirect', true],
    ['/iam//auth/login/basic/redirect', true],
]);
const authenticationHandler = (req, res, next) => {
    var _a;
    /**
     * TODO need to come up with better logic
     */
    if (whiteListedUrls.has(((_a = req.path) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || ''))
        return next();
    const userSession = req.session;
    if (userSession.user)
        return next();
    return new utils_1.ResponseObject(res, 401, {
        message: 'Full authentication is required to access this resource',
    }).build();
};
exports.default = authenticationHandler;
//# sourceMappingURL=auth.js.map