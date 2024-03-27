"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSA_SECRET = exports.MONGODB_URL = exports.IAM_SERVICE_PORT = void 0;
const dotenv_1 = require("dotenv");
if (process.env.NODE_ENV !== 'production') {
    (0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV || 'dev'}` });
}
else {
    (0, dotenv_1.config)();
}
_a = process.env, exports.IAM_SERVICE_PORT = _a.IAM_SERVICE_PORT, exports.MONGODB_URL = _a.MONGODB_URL, exports.RSA_SECRET = _a.RSA_SECRET;
//# sourceMappingURL=index.js.map