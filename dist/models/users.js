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
const mongoose_1 = require("mongoose");
const crypto_1 = require("../utils/crypto");
const constants_1 = require("../utils/constants");
const toLowerCase = (str) => str.trim().toLowerCase();
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, set: toLowerCase },
    email: { type: String, required: true, unique: true, set: toLowerCase },
    password: { type: String, required: false },
    access: { type: String, required: true, default: 'U' },
    provider: { type: String, required: true, default: 'basic' },
    app: {
        type: String,
        required: true,
        default: constants_1.DEFAULT_USER_APP_NAME,
        set: toLowerCase,
    },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified('password'))
            return next();
        const salt = (0, crypto_1.generateSalt)(16, 'hex');
        const hash = (0, crypto_1.generateHash)(user.password.trim(), salt, 1000, 64, 'sha512', 'hex');
        user.password = `${hash}.${salt}`;
        next();
    });
});
const UserModel = (0, mongoose_1.model)('User', userSchema);
UserModel.comparePassword = (existingPassword, enteredPassword) => {
    const [hash, salt] = existingPassword.split('.');
    const newhash = (0, crypto_1.generateHash)(enteredPassword, salt, 1000, 64, 'sha512', 'hex');
    return hash === newhash;
};
exports.default = UserModel;
//# sourceMappingURL=users.js.map