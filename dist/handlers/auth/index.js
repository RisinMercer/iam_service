"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../../models/users");
const utils_1 = require("../../utils");
const constants_1 = require("../../utils/constants");
const validations_1 = require("./validations");
const authService = {
    signup: {
        post: (req, res, next) => {
            try {
                const provider = req.query.provider;
                if (constants_1.AUTH_PROVIDERS.includes(provider))
                    return res.redirect(307, `${constants_1.BASIC_ROUTE}/${constants_1.BASIC_AUTH_ROUTE}/${provider}/redirect`);
                const error = new Error('Provider not available');
                error.status = 400;
                throw error;
            }
            catch (error) {
                console.log('Mercer -> error : ', error);
                next(error);
            }
        },
    },
    login: {
        post: (req, res, next) => {
            try {
                const provider = req.query.provider;
                if (constants_1.AUTH_PROVIDERS.includes(provider))
                    return res.redirect(307, `${constants_1.BASIC_ROUTE}/${constants_1.BASIC_AUTH_ROUTE}/login/${provider}/redirect`);
                const error = new Error('Provider not available');
                error.status = 400;
                throw error;
            }
            catch (error) {
                console.log('Mercer -> error : ', error);
                next(error);
            }
        },
    },
};
const basicAuthService = {
    signup: {
        post: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { username, email, password, app = constants_1.DEFAULT_USER_APP_NAME, } = req.body;
                /** for testing puspose, delete all users, then create new ones */
                // await UserModel.deleteMany({});
                const statusMessageResponse = yield (0, validations_1.validateBasicAuthBody)(username, email, password, app);
                if (!statusMessageResponse.getStatus()) {
                    throw new Error(statusMessageResponse.getMessage());
                }
                else {
                    console.log('Mercer -> username : ', username);
                    console.log('Mercer -> app : ', app);
                    const user = yield users_1.default.create({
                        username,
                        email,
                        password,
                        provider: 'basic',
                        app,
                    });
                    const userSession = req.session;
                    (0, utils_1.setUserToSession)(user, userSession);
                    return new utils_1.ResponseObject(res, 201, user).build();
                }
            }
            catch (error) {
                next(error);
            }
        }),
    },
    login: {
        post: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { username, password, app = constants_1.DEFAULT_USER_APP_NAME, } = req.body;
                if ((username === null || username === void 0 ? void 0 : username.trim()) && (password === null || password === void 0 ? void 0 : password.trim())) {
                    console.log('Mercer -> username : ', username);
                    const user = yield users_1.default.findOne({ username, app });
                    if (user) {
                        const isPasswordValid = users_1.default.comparePassword(user.password, password);
                        if (isPasswordValid) {
                            const userSession = req.session;
                            (0, utils_1.setUserToSession)(user, userSession);
                            return new utils_1.ResponseObject(res, 201, user).build();
                        }
                        const error = new Error('Password is invalid');
                        error.status = 401;
                        throw error;
                    }
                    const error = new Error('User with given username does not exists');
                    error.status = 401;
                    throw error;
                }
                const error = new Error('Invalid username or password');
                error.status = 400;
                throw error;
            }
            catch (error) {
                next(error);
            }
        }),
    },
};
exports.default = {
    authService,
    basicAuthService,
};
//# sourceMappingURL=index.js.map