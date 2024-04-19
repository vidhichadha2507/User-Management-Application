"use server";

import { getResetPasswordTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";

/**
 * Updates the password for a user using the provided token.
 * @param values - The values containing the new password.
 * @param token - The token used to verify the password reset request.
 * @returns An object indicating the result of the password update operation.
 *          If successful, it returns { success: "Password updated" }.
 *          If the token is not found, it returns { error: "Token not found" }.
 *          If the fields are invalid, it returns { error: "Invalid fields" }.
 *          If the token is invalid, it returns { error: "Invalid Token" }.
 *          If the token has expired, it returns { error: "Token expired" }.
 *          If the user does not exist, it returns { error: "Email does not exist" }.
 */
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

  const existingToken = await getResetPasswordTokenByToken(token);
  if (!existingToken) {
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
