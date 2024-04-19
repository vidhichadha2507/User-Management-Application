import { db } from "@/lib/db";

/**
 * Retrieves the two-factor confirmation record by user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object | null>} - The two-factor confirmation record, or null if not found.
 */
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
