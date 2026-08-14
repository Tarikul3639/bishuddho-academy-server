import { baseTemplate } from './base-email.template';

interface CertificateIssuedTemplateOptions {
  name: string;

  courseTitle: string;

  certificateNo: string;

  certificateUrl: string;
}

export function certificateIssuedTemplate({
  name,
  courseTitle,
  certificateNo,
  certificateUrl,
}: CertificateIssuedTemplateOptions): string {
  return baseTemplate({
    title: 'Certificate Issued',

    heading: `Congratulations, ${name}!`,

    content: `
<p>
Congratulations on successfully completing your course.
</p>

<p>
Your certificate has been issued and is now available.
</p>

<p>
<strong>Course:</strong> ${courseTitle}
</p>

<p>
<strong>Certificate No:</strong> ${certificateNo}
</p>

<p>
You can view or download your certificate anytime from your student dashboard.
</p>
`,

    buttonText: 'View Certificate',

    buttonUrl: certificateUrl,
  });
}
