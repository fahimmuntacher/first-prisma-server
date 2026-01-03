import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

console.log(process.env.APP_USER_EMAIL, process.env.APP_PASSWORD);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.BETTER_AUTH_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const info = await transporter.sendMail({
        from: '"Prismablog" <prisma@fhaim.com>',
        to: user.email,
        subject: "Verify your email address – Prismablog",
        text: `Hello ${user.name || "there"},
      
Thanks for signing up for Prismablog.
Please verify your email by clicking the link below:

${url}

If you didn’t create this account, you can safely ignore this email.`,
        html: `
      <div style="background-color:#f4f6f8;padding:30px;font-family:Arial,sans-serif;">
        <table width="100%" max-width="600" align="center" cellpadding="0" cellspacing="0" 
          style="background:#ffffff;border-radius:8px;padding:30px;">
          
          <tr>
            <td style="text-align:center;padding-bottom:20px;">
              <h1 style="margin:0;color:#4f46e5;">Prismablog</h1>
            </td>
          </tr>

          <tr>
            <td style="color:#333;font-size:16px;line-height:1.6;">
              <p>Hi ${user.name || "there"},</p>

              <p>
                Thanks for signing up for <strong>Prismablog</strong>!  
                Please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center;margin:30px 0;">
                <a href="${url}"
                  style="
                    background:#4f46e5;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:6px;
                    font-weight:bold;
                    display:inline-block;
                  ">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px;color:#666;">
                Or copy and paste this link into your browser:
              </p>

              <p style="font-size:14px;word-break:break-all;color:#4f46e5;">
                ${url}
              </p>

              <p style="margin-top:30px;font-size:14px;color:#666;">
                If you didn’t create an account, you can safely ignore this email.
              </p>

              <p style="margin-top:20px;">
                — The Prismablog Team
              </p>
            </td>
          </tr>

        </table>

        <p style="text-align:center;font-size:12px;color:#999;margin-top:20px;">
          © ${new Date().getFullYear()} Prismablog. All rights reserved.
        </p>
      </div>
      `,
      });

      console.log("Verification email sent:", info.messageId);
    },
  },
});
