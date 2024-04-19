"use server";

import { currentRole } from "@/lib/auth";
import { Role } from "@prisma/client";

/**
 * Checks if the current user has the role of an admin.
 * @returns {Promise<{ success: string } | { error: string }>} A promise that resolves to an object indicating whether the user is allowed or not.
 */
export const admin = async () => {
  const role = await currentRole();
  if (role === Role.ADMIN) {
    return { success: "Allowed!" };
  }

  return { error: "Not allowed!" };
};
