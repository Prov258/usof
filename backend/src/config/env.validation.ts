import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    APP_NAME: Joi.string(),
    APP_URL: Joi.string(),
    DB_CONNECTION: Joi.string(),
    DB_HOST: Joi.string(),
    DB_PORT: Joi.number().port(),
    DB_NAME: Joi.string(),
    DB_USERNAME: Joi.string(),
    DB_PASSWORD: Joi.string(),
    DATABASE_URL: Joi.string(),
    JWT_SECRET: Joi.string(),
    JWT_ACCESS_SECRET: Joi.string().min(8),
    JWT_ACCESS_TIME: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().min(8),
    JWT_REFRESH_TIME: Joi.string().default('7d'),
    MAIL_HOST: Joi.string(),
    MAIL_PORT: Joi.number().port(),
    MAIL_USERNAME: Joi.string(),
    MAIL_PASSWORD: Joi.string(),
    MAIL_ENCRYPTION: Joi.boolean(),
    MAIL_FROM_ADDRESS: Joi.string(),
    MAIL_FROM_NAME: Joi.string(),
    DEFAULT_AVATAR_PATH: Joi.string(),
});
