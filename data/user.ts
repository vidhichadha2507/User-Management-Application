import { db } from "@/lib/db";

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
