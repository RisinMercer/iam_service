"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = exports.generateSalt = exports.closeCipherDecipher = exports.cipherData = exports.decipherData = exports.generateCipherDecipher = void 0;
const crypto_1 = require("crypto");
const _1 = require(".");
const config_1 = require("../config");
const generateCipherDecipher = () => {
    const key = (0, crypto_1.createHash)('sha256')
        .update(config_1.RSA_SECRET)
        .digest('base64')
        .substring(0, 32);
    const iv = (0, crypto_1.randomBytes)(32);
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', key, iv);
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', key, iv);
    return { cipher, decipher };
};
exports.generateCipherDecipher = generateCipherDecipher;
function decipherData(decipher, encryptedData) {
    let decipherData = decipher.update(encryptedData, 'hex', 'utf-8');
    const data = (0, _1.isJsonString)(decipherData)
        ? JSON.parse(decipherData)
        : decipherData;
    return data;
}
exports.decipherData = decipherData;
function cipherData(cipher, object) {
    let cipherData = cipher.update(typeof object === 'string' ? object : JSON.stringify(object), 'utf-8', 'hex');
    return cipherData;
}
exports.cipherData = cipherData;
const closeCipherDecipher = (cipher, decipher) => {
    cipher.final();
    decipher.final();
};
exports.closeCipherDecipher = closeCipherDecipher;
const generateSalt = (bytes, encoding) => (0, crypto_1.randomBytes)(bytes).toString(encoding);
exports.generateSalt = generateSalt;
const generateHash = (value, salt, iterations, length, digest, encoding) => (0, crypto_1.pbkdf2Sync)(value, salt, iterations, length, digest).toString(encoding);
exports.generateHash = generateHash;
//# sourceMappingURL=crypto.js.map