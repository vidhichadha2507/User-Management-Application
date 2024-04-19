import { db } from "@/lib/db";

/**
 * Retrieves all organizations from the database.
 * @returns {Promise<Array<Organization> | null>} A promise that resolves to an array of organizations, or null if an error occurs.
 */
export const getAllOrganizations = async () => {
  try {
    const organizations = await db.organization.findMany();
    return organizations;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves an organization by its ID.
 * @param id - The ID of the organization to retrieve.
 * @returns The organization object if found, or null if not found or an error occurs.
 */
export const getOrganizationById = async (id: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: {
        id,
      },
    });
    return organization;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves an organization by manager ID.
 * @param {string} managerId - The ID of the manager.
 * @returns {Promise<Organization[] | null>} - A promise that resolves to an array of organizations or null if an error occurs.
 */
export const getOrganizationByManagerId = async (managerId: string) => {
  try {
    const organization = await db.organization.findMany({
      where: {
        managerId,
      },
    });
    return organization;
  } catch (error) {
    return null;
  }
};
