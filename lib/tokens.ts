import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "../data/verification-token";
import { db } from "@/lib/db";
import { getResetPasswordTokenByEmail } from "@/data/password-reset-token";

/**
 * Generates a verification token for the given email.
 * If an existing token exists for the email, it is deleted before creating a new one.
 * @param email - The email for which to generate the verification token.
 * @returns The newly generated verification token.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt: expires,
    },
  });

  return verificationToken;
};

/**
 * Generates a password reset token for the given email.
 * If an existing token exists for the email, it is deleted before creating a new one.
 *
 * @param email - The email address for which to generate the password reset token.
 * @returns The created password reset token.
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: expires,
    },
  });

  return passwordResetToken;
};

/**
 * Generates a two-factor authentication token for the specified email.
 * If an existing token for the email exists, it will be deleted before creating a new one.
 * The token will expire after 5 minutes.
 *
 * @param email - The email for which to generate the token.
 * @returns The created two-factor authentication token.
 */
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_00, 100_00_00).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await db.twoFactorToken.findFirst({
    where: {
      email,
    },
  });

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt: expires,
    },
  });

  return twoFactorToken;
};
