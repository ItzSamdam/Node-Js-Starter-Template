import { config } from 'dotenv';
import { join } from 'path';
import { object, string, number } from 'joi';

//link dotenv
config({ path: join(__dirname, '../../.env') });

//env validation sequence
const envValidation = object()
    .keys({
        NODE_ENV: string().valid('development', 'production', 'test').required(),
        PORT: number().default(3000),

        DB_HOST: string().default('localhost'),
        DB_USER: string().required(),
        DB_PASS: string().required(),
        // DB_PASS: Joi.string().allow(null, ''), allowing null values
        DB_NAME: string().required(),

        JWT_SECRET: string().required().description('JWT secret key'),

        JWT_ACCESS_EXPIRATION_MINUTES: number()
            .default(30)
            .description('minutes after which access tokens expire'),

        JWT_REFRESH_EXPIRATION_DAYS: number()
            .default(30)
            .description('days after which refresh tokens expire'),

        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number()
            .default(10)
            .description('minutes after which reset password token expires'),

        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number()
            .default(10)
            .description('minutes after which verify email token expires'),

        LOG_FOLDER: string().required(),
        LOG_FILE: string().required(),
        LOG_LEVEL: string().required(),

        REDIS_HOST: string().default('127.0.0.1'),
        REDIS_PORT: number().default(6379),
        REDIS_USE_PASSWORD: string().default('no'),
        REDIS_PASSWORD: string(),

        MAILGUN_API_KEY: string().required(),
        MAILGUN_DOMAIN: string().required(),
        SYSTEM_EMAIL: string().required(),

        CLOUDINARY_CLOUD_NAME: string().required(),
        CLOUDINARY_API_KEY: string().required(),
        CLOUDINARY_API_SECRET: string().required()
    })
    .unknown();

const { value: envVar, error } = envValidation
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const nodeEnv = envVar.NODE_ENV;
export const port = envVar.PORT;
export const dbHost = envVar.DB_HOST;
export const dbUser = envVar.DB_USER;
export const dbPass = envVar.DB_PASS;
export const dbName = envVar.DB_NAME;

export const jwt = {
    secret: envVar.JWT_SECRET,
    accessExpirationMinutes: envVar.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVar.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVar.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVar.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
};
export const logConfig = {
    logFolder: envVar.LOG_FOLDER,
    logFile: envVar.LOG_FILE,
    logLevel: envVar.LOG_LEVEL,
};
export const redis = {
    host: envVar.REDIS_HOST,
    port: envVar.REDIS_PORT,
    usePassword: envVar.REDIS_USE_PASSWORD,
    password: envVar.REDIS_PASSWORD,
};
export const mailgun = {
    apiKey: envVar.MAILGUN_API_KEY,
    domain: envVar.MAILGUN_DOMAIN,
};
export const cloudinary = {
    cloudName: envVar.CLOUDINARY_CLOUD_NAME,
    cloudApiKey: envVar.CLOUDINARY_API_KEY,
    cloudApiSecret: envVar.CLOUDINARY_API_SECRET
};
export const systemEmail = envVar.SYSTEM_EMAIL;
