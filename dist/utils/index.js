"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRoutes = exports.initializeServer = exports.setUserToSession = exports.isJsonString = exports.GenericResponse = exports.StatusMessageResponse = exports.ResponseObject = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const middlewares_1 = require("../middlewares");
const routes_1 = require("../routes");
const constants_1 = require("./constants");
class ResponseObject {
    constructor(response, status, body) {
        this.build = () => {
            return this.response.status(this.status).json(this.body || {});
        };
        this.cookie = (cookieName, cookieValue, options) => {
            this.response.cookie(cookieName, cookieValue, options);
            return this;
        };
        this.response = response;
        this.status = status;
        this.body = body;
    }
}
exports.ResponseObject = ResponseObject;
class StatusMessageResponse {
    constructor(status, message) {
        this.getStatus = () => this.status;
        this.getMessage = () => this.message;
        this.status = status !== null && status !== void 0 ? status : false;
        this.message = message !== null && message !== void 0 ? message : 'Exception Occured';
    }
}
exports.StatusMessageResponse = StatusMessageResponse;
class GenericResponse {
    constructor() {
        this.getStatus = () => this.status;
        this.getMessage = () => this.message;
        this.getData = () => this.data;
    }
}
exports.GenericResponse = GenericResponse;
const isJsonString = (str) => {
    try {
        return !!(JSON.parse(str) && str);
    }
    catch (error) {
        return false;
    }
};
exports.isJsonString = isJsonString;
function setUserToSession(user, session) {
    if (user && session) {
        session.user = user;
    }
    else {
        const error = new Error('Unable to set user to session');
        throw error;
    }
}
exports.setUserToSession = setUserToSession;
const initializeServer = (app) => {
    mongoose_1.default.set('debug', true);
    mongoose_1.default.Promise = Promise;
    mongoose_1.default
        .connect(config_1.MONGODB_URL)
        .then(() => app.listen(config_1.IAM_SERVICE_PORT, () => {
        console.log(`[Server]: IAM running at PORT ${config_1.IAM_SERVICE_PORT}`);
    }))
        .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });
};
exports.initializeServer = initializeServer;
const buildRoutes = (app) => {
    /** Middlewares */
    app.use(middlewares_1.authMiddleware);
    /** Custom Routes */
    app.use(constants_1.BASIC_ROUTE, routes_1.ReadyRouter);
    app.use(constants_1.BASIC_ROUTE, routes_1.AuthRouter);
    /** Default Route */
    app.get('/*', (req, res) => {
        res.redirect(`${constants_1.BASIC_ROUTE}${constants_1.BASIC_READY_ROUTE}`);
    });
};
exports.buildRoutes = buildRoutes;
//# sourceMappingURL=index.js.map