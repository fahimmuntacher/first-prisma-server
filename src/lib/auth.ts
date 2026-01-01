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
        console.log(user, url, token);
      const info = await transporter.sendMail({
        from: '"Prismablog" <prisma@fhaim.com>',
        to: "mazumderhabib654@gmail.com",
        subject: "Hello ✔",
        text: `Hello world? please verify now ${url}`, // Plain-text version of the message
        html: "<b>Hello world?</b>", // HTML version of the message
      });

      console.log("Message sent:", info.messageId);
    },
  },
});
