import { db } from "@/lib/db";

/**
 * Retrieves an account by user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Account | null>} - A promise that resolves to the account object, or null if not found.
 */
export const getAccountByUserId = async (userId: string) => {
  const account = await db.account.findFirst({
    where: {
      userId,
    },
  });

  return account;
};
