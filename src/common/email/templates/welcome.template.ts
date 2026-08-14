import { baseTemplate } from './base-email.template';

interface WelcomeTemplateOptions {
  name: string;

  loginUrl: string;
}

export function welcomeTemplate({
  name,
  loginUrl,
}: WelcomeTemplateOptions): string {
  return baseTemplate({
    title: 'Welcome to Bishuddho Academy',

    heading: `Welcome, ${name}!`,

    content: `
<p>
Your account has been successfully created.
Welcome to <strong>Bishuddho Academy</strong>.
</p>

<p>
You can now sign in and access your courses, progress, certificates, and other learning resources.
</p>

<p>
We're excited to have you as part of our learning community.
We wish you a successful learning journey.
</p>
`,

    buttonText: 'Go to Login',

    buttonUrl: loginUrl,
  });
}

/**
 * Use case
 * */

// const html =
//     welcomeTemplate({
//         name: user.name,
//         loginUrl,
//     });

// await this.emailService.send({
//     to: user.email,
//     subject: EmailSubjects.WELCOME,
//     html,
// });
