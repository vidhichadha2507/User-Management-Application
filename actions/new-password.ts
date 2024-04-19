"use server";

import { getResetPasswordTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Token not found" };
  }

  const validatedFileds = NewPasswordSchema.safeParse(values);
  if (!validatedFileds.success) {
    return { error: "Invalid fields" };
  }
  const { password } = validatedFileds.data;
  console.log(token);

  const existingToken = await getResetPasswordTokenByToken(token);
  if (!existingToken) {
    console.log(existingToken);

    return { error: "Invalid Token" };
  }
  if (existingToken.expiresAt < new Date()) {
    return { error: "Token expired" };
  }
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password updated" };
};
