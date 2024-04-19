"use server";

import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { OrganizationModel } from "@/models/User";

export const register = async (
  values: z.infer<typeof RegisterSchema>,
  organizations: OrganizationModel[]
) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "User already exists! Please login" };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const user = await getUserByEmail(email);
  if (!user) {
    return { error: "User not found" };
  }

  // Create organization
  organizations.map(async (ord) => {
    await db.userOrganization.create({
      data: {
        userId: user.id,
        organizationId: ord.value,
      },
    });
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent" };
};
