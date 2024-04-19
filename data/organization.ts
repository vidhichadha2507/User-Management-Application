import { db } from "@/lib/db";

export const getAllOrganizations = async () => {
  try {
    const organizations = await db.organization.findMany();
    return organizations;
  } catch (error) {
    return null;
  }
};

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
