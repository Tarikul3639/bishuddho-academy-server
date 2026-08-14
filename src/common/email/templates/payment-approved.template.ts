import { baseTemplate } from './base-email.template';

interface PaymentApprovedTemplateOptions {
  name: string;

  courseTitle: string;

  amount: number;

  dashboardUrl: string;
}

export function paymentApprovedTemplate({
  name,
  courseTitle,
  amount,
  dashboardUrl,
}: PaymentApprovedTemplateOptions): string {
  return baseTemplate({
    title: 'Payment Approved',

    heading: `Congratulations, ${name}!`,

    content: `
<p>
Your payment has been successfully approved.
</p>

<p>
<strong>Course:</strong> ${courseTitle}
</p>

<p>
<strong>Amount:</strong> ৳${amount.toLocaleString()}
</p>

<p>
You now have full access to your course materials and can start learning immediately.
</p>

<p>
Thank you for choosing <strong>Bishuddho Academy</strong>.
We wish you a successful learning journey.
</p>
`,

    buttonText: 'Go to Dashboard',

    buttonUrl: dashboardUrl,
  });
}

/**
 * Use case
 * */

// const html =
//     paymentApprovedTemplate({
//         name: user.name,
//         courseTitle: course.title,
//         amount: payment.amount,
//         dashboardUrl,
//     });

// await this.emailService.send({
//     to: user.email,
//     subject:
//         EmailSubjects.PAYMENT_APPROVED,
//     html,
// });
