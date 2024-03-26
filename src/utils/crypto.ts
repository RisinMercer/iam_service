import {
  CipherGCM,
  DecipherGCM,
  createCipheriv,
  createDecipheriv,
  createHash,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';
import { isJsonString } from '.';
import { RSA_SECRET } from '../config';

export const generateCipherDecipher = (): {
  cipher: CipherGCM;
  decipher: DecipherGCM;
} => {
  const key = createHash('sha256')
    .update(RSA_SECRET)
    .digest('base64')
    .substring(0, 32);
  const iv = randomBytes(32);
  const cipher: CipherGCM = createCipheriv('aes-256-gcm', key, iv);
  const decipher: DecipherGCM = createDecipheriv('aes-256-gcm', key, iv);
  return { cipher, decipher };
};

export function decipherData<T>(
  decipher: DecipherGCM,
  encryptedData: string,
): T {
  let decipherData = decipher.update(encryptedData, 'hex', 'utf-8');
  const data: T = isJsonString(decipherData)
    ? JSON.parse(decipherData)
    : decipherData;
  return data;
}

export function cipherData<T>(cipher: CipherGCM, object: T): string {
  let cipherData = cipher.update(
    typeof object === 'string' ? object : JSON.stringify(object),
    'utf-8',
    'hex',
  );
  return cipherData;
}

export const closeCipherDecipher = (
  cipher: CipherGCM,
  decipher: DecipherGCM,
): void => {
  cipher.final();
  decipher.final();
};

export const generateSalt = (bytes: 8 | 16 | 32, encoding: BufferEncoding) =>
  randomBytes(bytes).toString(encoding);

export const generateHash = (
  value: string,
  salt: string,
  iterations: number,
  length: number,
  digest: string,
  encoding: BufferEncoding,
) => pbkdf2Sync(value, salt, iterations, length, digest).toString(encoding);
