import { Resend } from "resend";

const domain = process.env.NEXT_PUBLIC_API_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a verification email to the specified email address with a confirmation link.
 * @param email - The email address to send the verification email to.
 * @param token - The verification token to include in the confirmation link.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "admin@assignmentpractice.live",
    to: email,
    subject: "Confirm your email",
    html: `<a href="${confirmLink}">Confirm your email</a>`,
  });
};

/**
 * Sends a password reset email to the specified email address.
 * @param email - The email address of the recipient.
 * @param token - The password reset token.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "admin@assignmentpractice.live",
    to: email,
    subject: "Reset your password",
    html: `<a href="${resetLink}">Reset your password</a>`,
  });
};

/**
 * Sends a two-factor authentication email to the specified email address.
 * @param email - The recipient's email address.
 * @param token - The two-factor authentication token.
 */
export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "admin@assignmentpractice.live",
    to: email,
    subject: "Two-factor authentication",
    html: `Your two-factor token is: ${token}`,
  });
};
