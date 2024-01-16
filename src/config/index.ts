import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });
} else {
  config();
}

export const { IAM_SERVICE_PORT, MONGODB_URL, RSA_SECRET } = process.env;
