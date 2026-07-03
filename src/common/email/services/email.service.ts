import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";

import { SendEmailOptions } from "../interfaces/send-email.interface";

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    async send({
        to,
        subject,
        html,
        from,
        cc,
        bcc,
        replyTo,
        attachments,
    }: SendEmailOptions): Promise<void> {
        await this.mailerService.sendMail({
            to,
            from:
                from ??
                `"${this.configService.get("MAIL_FROM_NAME")}" <${this.configService.get("MAIL_FROM_EMAIL")}>`,
            cc,
            bcc,
            replyTo,
            subject,
            html,
            attachments,
        });
    }
}