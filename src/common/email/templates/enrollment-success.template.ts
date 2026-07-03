import { baseTemplate } from "./base-email.template";

interface EnrollmentSuccessTemplateOptions {
    name: string;

    courseTitle: string;

    startDate: string;

    dashboardUrl: string;
}

export function enrollmentSuccessTemplate({
    name,
    courseTitle,
    startDate,
    dashboardUrl,
}: EnrollmentSuccessTemplateOptions): string {
    return baseTemplate({
        title: "Course Enrollment Successful",

        heading: `Congratulations, ${name}!`,

        content: `
<p>
Your enrollment has been confirmed successfully.
</p>

<p>
<strong>Course:</strong> ${courseTitle}
</p>

<p>
<strong>Start Date:</strong> ${startDate}
</p>

<p>
You now have access to your course dashboard where you can follow your learning progress, watch lessons, download resources, and participate in class activities.
</p>

<p>
Thank you for choosing <strong>Bishuddho Academy</strong>.
We wish you a wonderful learning experience.
</p>
`,

        buttonText: "Go to My Course",

        buttonUrl: dashboardUrl,
    });
}


/**
 * Use case
 * */

// const html =
//     enrollmentSuccessTemplate({
//         name: user.name,
//         courseTitle: course.title,
//         startDate:
//             course.startDate.toDateString(),
//         dashboardUrl,
//     });

// await this.emailService.send({
//     to: user.email,
//     subject:
//         EmailSubjects.ENROLLMENT_SUCCESS,
//     html,
// });