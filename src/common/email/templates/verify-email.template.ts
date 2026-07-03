import { baseTemplate } from "./base-email.template";

interface VerifyEmailTemplateOptions {
    name: string;

    verificationUrl: string;
}

export function verifyEmailTemplate({
    name,
    verificationUrl,
}: VerifyEmailTemplateOptions): string {
    return baseTemplate({
        title: "Verify Your Email",

        heading: `Welcome, ${name}`,

        content: `
<p>
Thank you for creating your <strong>Bishuddho Academy</strong> account.
</p>

<p>
Before getting started, please verify your email address by clicking the button below.
</p>

<p>
This verification link will expire after a certain period for security reasons.
If you did not create this account, you can safely ignore this email.
</p>
`,

        buttonText: "Verify Email",

        buttonUrl: verificationUrl,
    });
}