import { db } from "@/lib/db";

/**
 * Retrieves a password reset token by its token value.
 * @param {string} token - The token value to search for.
 * @returns {Promise<object|null>} - A promise that resolves to the password reset token object if found, or null if not found.
 */
export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordToken;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves the reset password token for a given email.
 * @param email - The email address associated with the password reset token.
 * @returns The password reset token object if found, or null if not found or an error occurs.
 */
export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return passwordToken;
  } catch (error) {
    return null;
  }
};
