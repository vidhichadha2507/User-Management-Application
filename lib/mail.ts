import { Resend } from "resend";

const domain = process.env.NEXT_PUBLIC_API_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "admin@assignmentpractice.live",
    to: email,
    subject: "Confirm your email",
    html: `<a href="${confirmLink}">Confirm your email</a>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "admin@assignmentpractice.live",
    to: email,
    subject: "Reset your password",
    html: `<a href="${resetLink}">Reset your password</a>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "admin@assignmentpractice.live",
    to: email,
    subject: "Two-factor authentication",
    html: `Your two-factor token is: ${token}`,
  });
};
