"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const error_1 = require("./handlers/error");
const utils_1 = require("./utils");
const app = express();
const corsOptions = {
    origin: ['*'],
};
const cookieOptions = {
    maxAge: 1000 * 60,
};
const sessionOptions = {
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
(0, utils_1.buildRoutes)(app);
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(error_1.errorHandler);
/** Initializing Server with MongoDB */
(0, utils_1.initializeServer)(app);
module.exports = app;
//# sourceMappingURL=server.js.map