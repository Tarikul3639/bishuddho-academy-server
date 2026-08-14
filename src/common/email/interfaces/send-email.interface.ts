export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;

  attachments?: {
    filename: string;
    path: string;
    contentType?: string;
  }[];
}
