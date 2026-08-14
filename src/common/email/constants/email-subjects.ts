export const EmailSubjects = {
  FORGOT_PASSWORD: 'Reset Your Password',

  PASSWORD_RESET_SUCCESS: 'Your Password Has Been Reset',

  VERIFY_EMAIL: 'Verify Your Email Address',

  EMAIL_VERIFIED: 'Email Verified Successfully',

  WELCOME: 'Welcome to Bishuddho Academy',

  ENROLLMENT_SUCCESS: 'Course Enrollment Successful',

  PAYMENT_APPROVED: 'Payment Approved',

  PAYMENT_REJECTED: 'Payment Rejected',

  CERTIFICATE_ISSUED: 'Your Course Certificate Is Ready',

  TEACHER_ACCOUNT_CREATED: 'Your Teacher Account Is Ready',
} as const;

/**
 * Use case
 * */

// import { EmailSubjects } from "../constants/email-subjects";

// await this.emailService.send({
//     to: user.email,
//     subject:
//         EmailSubjects.FORGOT_PASSWORD,
//     html,
// });
