import { registerAs } from "@nestjs/config";

export default registerAs("mail", () => ({
    host: process.env.MAIL_HOST,

    port: Number(process.env.MAIL_PORT),

    secure:
        process.env.MAIL_SECURE === "true",

    user: process.env.MAIL_USER,

    password:
        process.env.MAIL_PASSWORD,

    fromName:
        process.env.MAIL_FROM_NAME,

    fromEmail:
        process.env.MAIL_FROM_EMAIL,
}));