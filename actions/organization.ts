"use server";
import { getAllOrganizations, getOrganizationById } from "@/data/organization";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { OrganizationSchema } from "@/schemas";
import { Role } from "@prisma/client";
import * as z from "zod";

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
  console.log(orgs);

  console.log(values);
  return { success: "Organization created" };
};

export const updateOrganization = async (
  id: string,
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

export const deleteOrganization = async (id: string) => {
  const org = await getOrganizationById(id);

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
