"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import bcrypt from "bcryptjs";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";

/**
 * Updates the settings for a user.
 *
 * @param values - The new settings values.
 * @returns An object indicating the result of the settings update.
 *          - If the user is not authenticated, returns an error message.
 *          - If the user ID is undefined, returns an error message.
 *          - If the user is unauthorized, returns an error message.
 *          - If the email is already in use, returns an error message.
 *          - If the verification email is sent successfully, returns a success message.
 *          - If the password is incorrect, returns an error message.
 *          - If the settings are updated successfully, returns a success message.
 */
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }
  if (!user.id) {
    return { error: "User ID is undefined" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.isTwoFactorEnabled = undefined;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification email sent" };
  }

  if (values.newPassword && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password!,
      dbUser.password!
    );
    if (!passwordMatch) {
      return { error: "Incorrect password" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });
  return { success: "Settings updated" };
};
