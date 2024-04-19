"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

/**
 * Verifies the email address of a user using a verification token.
 * @param token - The verification token.
 * @returns An object indicating the result of the verification process.
 *          If successful, it returns { success: "Email verified" }.
 *          If the token does not exist, it returns { error: "Token does not exist" }.
 *          If the token has expired, it returns { error: "Token has expired" }.
 *          If the user does not exist, it returns { error: "User does not exist" }.
 */
export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  if (new Date() > existingToken.expiresAt) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist" };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified" };
};
