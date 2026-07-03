import { baseTemplate } from "./base-email.template";

interface ForgotPasswordTemplateOptions {
  name: string;
  resetUrl: string;
}

export function forgotPasswordTemplate({
  name,
  resetUrl,
}: ForgotPasswordTemplateOptions): string {
  return baseTemplate({
    title: "Reset Your Password",
    heading: "Reset your password",
    content: `
      <p>Hello <strong>${name}</strong>,</p>

      <p>
        We received a request to reset your <strong>Bishuddho Academy</strong>
        password. This link expires in <strong>15 minutes</strong> and can only
        be used once.
      </p>

      <p>
        If you didn't request this, you can safely ignore this email.
      </p>
    `,
    buttonText: "Reset Password",
    buttonUrl: resetUrl,
  });
}