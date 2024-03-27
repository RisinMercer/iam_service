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
exports.validateBasicAuthBody = void 0;
const users_1 = require("../../models/users");
const utils_1 = require("../../utils");
const constants_1 = require("../../utils/constants");
const validateBasicAuthBody = (username, email, password, app) => __awaiter(void 0, void 0, void 0, function* () {
    let statusMessageResponse = new utils_1.StatusMessageResponse(false, 'Invalid Payload for Basic Auth');
    if (!(username === null || username === void 0 ? void 0 : username.trim()) && (email === null || email === void 0 ? void 0 : email.trim()) && (password === null || password === void 0 ? void 0 : password.trim())) {
        statusMessageResponse = new utils_1.StatusMessageResponse(false, 'Username cannot be empty');
    }
    else if ((username === null || username === void 0 ? void 0 : username.trim()) && !(email === null || email === void 0 ? void 0 : email.trim()) && (password === null || password === void 0 ? void 0 : password.trim())) {
        statusMessageResponse = new utils_1.StatusMessageResponse(false, 'Email cannot be empty');
    }
    else if (!(username === null || username === void 0 ? void 0 : username.trim()) && !(email === null || email === void 0 ? void 0 : email.trim()) && (password === null || password === void 0 ? void 0 : password.trim())) {
        statusMessageResponse = new utils_1.StatusMessageResponse(false, 'Username and Email cannot be empty');
    }
    else if (!(password === null || password === void 0 ? void 0 : password.trim())) {
        statusMessageResponse = new utils_1.StatusMessageResponse(false, 'Password cannt be empty');
    }
    else if (!(app === null || app === void 0 ? void 0 : app.trim())) {
        statusMessageResponse = new utils_1.StatusMessageResponse(false, 'App cannt be empty');
    }
    else {
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();
        if (app === constants_1.DEFAULT_USER_APP_NAME)
            app = app.trim().toLowerCase();
        const existingUser = yield users_1.default.findOne({
            $or: [{ username }, { email }],
            app,
        });
        if (existingUser) {
            statusMessageResponse = new utils_1.StatusMessageResponse(false, 'Username or Email already exists');
        }
        else {
            statusMessageResponse = new utils_1.StatusMessageResponse(true, '');
        }
    }
    return statusMessageResponse;
});
exports.validateBasicAuthBody = validateBasicAuthBody;
//# sourceMappingURL=validations.js.map