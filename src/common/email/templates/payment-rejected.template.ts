import { baseTemplate } from "./base-email.template";

interface PaymentRejectedTemplateOptions {
    name: string;

    courseTitle: string;

    amount: number;

    reason: string;

    paymentUrl: string;
}

export function paymentRejectedTemplate({
    name,
    courseTitle,
    amount,
    reason,
    paymentUrl,
}: PaymentRejectedTemplateOptions): string {
    return baseTemplate({
        title: "Payment Rejected",

        heading: `Hello, ${name}`,

        content: `
<p>
Unfortunately, your payment could not be approved.
</p>

<p>
<strong>Course:</strong> ${courseTitle}
</p>

<p>
<strong>Amount:</strong> ৳${amount.toLocaleString()}
</p>

<p>
<strong>Reason:</strong> ${reason}
</p>

<p>
Please review the payment information and submit a new payment.
If you believe this was a mistake, contact our support team.
</p>
`,

        buttonText: "Try Again",

        buttonUrl: paymentUrl,
    });
}


/**
 * Use case
 * */

// const html =
//     paymentRejectedTemplate({
//         name: user.name,
//         courseTitle: course.title,
//         amount: payment.amount,
//         reason:
//             payment.rejectionReason ??
//             "No reason provided.",
//         paymentUrl,
//     });

// await this.emailService.send({
//     to: user.email,
//     subject:
//         EmailSubjects.PAYMENT_REJECTED,
//     html,
// });