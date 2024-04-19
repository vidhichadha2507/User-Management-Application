"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

/**
 * Resets the user's password by sending a password reset email.
 *
 * @param values - The values containing the user's email.
 * @returns An object indicating the result of the password reset operation.
 *          - If the email is not valid, it returns an object with an `error` property.
 *          - If the email is not found in the system, it returns an object with an `error` property.
 *          - If the password reset email is successfully sent, it returns an object with a `success` property.
 */
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.parse(values);
  if (!validatedFields) {
    return { error: "Email is not valid" };
  }

  const { email } = validatedFields;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent" };
};
