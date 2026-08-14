interface BaseEmailTemplateOptions {
  title: string;
  heading: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}

export function baseTemplate({
  title,
  heading,
  content,
  buttonText,
  buttonUrl,
}: BaseEmailTemplateOptions): string {
  const logoUrl = `${process.env.FRONTEND_URL}/logo.jpg`;

  return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${title}</title>
</head>

<body style="margin:0; padding:0; background:#f8fafc; font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background:#f8fafc;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:600px; max-width:600px; background:#ffffff; border:0px solid #e5e7eb; border-radius:4px; overflow:hidden;">
                    
                    <!-- ================= HEADER ================= -->
                    <tr>
                        <td align="center" bgcolor="#ffffff" style="padding:32px; background:#ffffff; border-bottom:1px solid #eef2f7;">
                            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                                <tr>
                                    <td valign="middle" style="padding-right:14px;">
                                        <img src="${logoUrl}" alt="Bishuddho Academy" width="48" height="48" style="display:block; width:48px; height:48px; border-radius:8px;" />
                                    </td>
                                    <td valign="middle">
                                        <div style="font-size:28px; font-weight:800; color:#111827; line-height:1; text-transform:uppercase; letter-spacing:-0.4px; white-space:nowrap;">
                                            Bishudd<span style="color:#2563eb;">HO</span>
                                        </div>
                                        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">
                                            <tr>
                                                <td style="color:#2563eb; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:3px; white-space:nowrap;">Academy</td>
                                                <td width="8"></td>
                                                <td width="26" style="border-top:1px solid #2563eb;"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- ================= BODY ================= -->
                    <tr>
                        <td bgcolor="#ffffff" style="padding:24px 14px; background:#ffffff;">
                            <h2 style="margin:0 0 20px; color:#111827; font-size:28px; font-weight:700; line-height:1.3;">
                                ${heading}
                            </h2>
                            <div style="color:#475569; font-size:15px; line-height:1.9;">
                                ${content}
                            </div>

                            ${
                              buttonText && buttonUrl
                                ? `
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:36px;">
                                <tr>
                                    <td align="center">
                                        <a href="${buttonUrl}" target="_blank" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:11px 26px; border-radius:8px; font-size:14px; font-weight:700;">
                                            ${buttonText}
                                        </a>
                                    </td>
                                </tr>
                            </table>`
                                : ''
                            }
                        </td>
                    </tr>

                    <!-- ================= DIVIDER ================= -->
                    <tr>
                        <td bgcolor="#ffffff" style="border-top:1px solid #eef2f7; background:#ffffff;"></td>
                    </tr>

                    <!-- ================= FOOTER ================= -->
                    <tr>
                        <td align="center" bgcolor="#f8fafc" style="padding:28px; background:#f8fafc;">
                            <p style="margin:0; color:#0f172a; font-size:15px; font-weight:700;">Bishuddho Academy</p>
                            <p style="margin:10px 0 0; color:#64748b; font-size:13px; line-height:1.8;">Empowering students through quality education.</p>
                            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:24px auto 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.FRONTEND_URL}" style="color:#2563eb; text-decoration:none; font-size:13px; font-weight:600;">Website</a>
                                    </td>
                                    <td width="20"></td>
                                    <td align="center">
                                        <a href="mailto:${process.env.MAIL_FROM_EMAIL}" style="color:#2563eb; text-decoration:none; font-size:13px; font-weight:600;">Support</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:24px 0 0; color:#94a3b8; font-size:12px; line-height:1.7;">
                                You received this email because you have an account with <strong>Bishuddho Academy</strong>.
                            </p>
                            <p style="margin:12px 0 0; color:#94a3b8; font-size:12px;">
                                © ${new Date().getFullYear()} Bishuddho Academy. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}
