import { db } from "@/lib/db";

/**
 * Retrieves a two-factor token by its token value.
 * @param {string} token - The token value to search for.
 * @returns {Promise<TwoFactorToken | null>} - A promise that resolves to the found two-factor token, or null if not found.
 */
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves the two-factor token associated with the given email.
 * @param email - The email address to search for.
 * @returns The two-factor token if found, or null if not found or an error occurred.
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
