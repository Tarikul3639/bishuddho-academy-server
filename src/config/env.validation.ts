import * as Joi from "joi";

export const envValidationSchema = Joi.object({
    /* APP */
    NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),

    PORT: Joi.number().default(3000),

    /* DATABASE */
    MONGO_URI: Joi.string().required(),

    /* AUTH (optional for now) */
    JWT_ACCESS_SECRET: Joi.string().default("deenseries-access-key"),
    JWT_ACCESS_EXPIRES_IN: Joi.string().default("10m"),
    JWT_REFRESH_SECRET: Joi.string().default("deenseries-refresh-key"),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d")
});