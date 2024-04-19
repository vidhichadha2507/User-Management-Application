import { auth } from "@/auth";

/**
 * Retrieves the current user from the session.
 * @returns {Promise<User | undefined>} The current user object, or undefined if not found.
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

/**
 * Retrieves the current role of the user.
 * @returns {Promise<string | undefined>} The current role of the user, or undefined if the session is not available.
 */
export const currentRole = async () => {
  const session = await auth();
  return session?.user.role;
};
