"use server";
import { getAllOrganizations, getOrganizationById } from "@/data/organization";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { OrganizationSchema } from "@/schemas";
import { Role } from "@prisma/client";
import * as z from "zod";

/**
 * Creates an organization with the provided values.
 * @param values - The values for creating the organization.
 * @returns An object indicating the result of the organization creation.
 *          If successful, it returns { success: "Organization created" }.
 *          If there are any validation errors, it returns { error: "Invalid fields" }.
 *          If the email is missing, it returns { error: "Email is required" }.
 *          If the manager does not exist, it returns { error: "Manager does not exist" }.
 *          If the provided user is not a manager, it returns { error: "Provided user is not a manager" }.
 */
export const organization = async (
  values: z.infer<typeof OrganizationSchema>
) => {
  const validatedFields = OrganizationSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  if (!values.email) {
    return { error: "Email is required" };
  }

  const managerId = await getUserByEmail(values.email);
  if (!managerId) {
    return { error: "Manager does not exist" };
  }

  if (managerId.role !== Role.MANAGER) {
    return { error: "Provided user is not a manager" };
  }

  await db.organization.create({
    data: {
      name: values.name,
      managerId: managerId.id,
    },
  });
  const orgs = await getAllOrganizations();

  return { success: "Organization created" };
};

/**
 * Updates an organization with the provided values.
 * @param id - The ID of the organization to update.
 * @param values - The values to update the organization with.
 * @param role - The role of the user performing the update.
 * @returns An object indicating the result of the update operation.
 */
export const updateOrganization = async (
  id: string,
  values: z.infer<typeof OrganizationSchema>,
  role: Role
) => {
  const validatedFields = OrganizationSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  if (role !== Role.ADMIN) {
    return { error: "Unauthorized" };
  }

  if (!values.email) {
    return { error: "Email is required" };
  }

  const managerId = await getUserByEmail(values.email);
  if (!managerId) {
    return { error: "Manager does not exist" };
  }

  if (managerId.role !== Role.MANAGER) {
    return { error: "Provided user is not a manager" };
  }

  await db.organization.update({
    where: {
      id,
    },
    data: {
      name: values.name,
      managerId: managerId.id,
    },
  });
  return { success: "Organization updated" };
};

/**
 * Deletes an organization by its ID.
 * @param id - The ID of the organization to delete.
 * @param role - The role of the user performing the deletion.
 * @returns An object indicating the result of the deletion operation.
 *          If the deletion is successful, the object will contain a `success` property with the value "Organization deleted".
 *          If the user is unauthorized, the object will contain an `error` property with the value "Unauthorized".
 *          If the organization is not found, the object will contain an `error` property with the value "Organization not found".
 */
export const deleteOrganization = async (id: string, role: Role) => {
  const org = await getOrganizationById(id);

  if (role !== Role.ADMIN) {
    return { error: "Unauthorized" };
  }

  if (!org) {
    return { error: "Organization not found" };
  }

  await db.organization.delete({
    where: {
      id,
    },
  });
  return { success: "Organization deleted" };
};
