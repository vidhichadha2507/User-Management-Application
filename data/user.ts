import { db } from "@/lib/db";

/**
 * Retrieves a user from the database based on their email.
 * @param email - The email of the user to retrieve.
 * @returns A Promise that resolves to the user object if found, or null if not found or an error occurred.
 */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves a user by their ID.
 * @param id - The ID of the user to retrieve.
 * @returns A Promise that resolves to the user object if found, or null if not found or an error occurred.
 */
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves users by organization ID.
 * @param organizationId - The ID of the organization.
 * @returns A promise that resolves to an array of users, or null if an error occurs.
 */
export const getUsersByOrganizationId = async (organizationId: string) => {
  try {
    const users = await db.userOrganization.findMany({
      where: {
        organizationId,
      },
    });
    return users;
  } catch (error) {
    return null;
  }
};
