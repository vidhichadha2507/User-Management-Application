"use server";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import * as z from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

/**
 * Authenticates a user by logging them in.
 *
 * @param values - The login credentials provided by the user.
 * @param callbackUrl - The URL to redirect the user to after successful login.
 * @returns An object containing the result of the login operation.
 *          - If successful, it returns `{ success: "Confirmation email sent" }` if email verification is required,
 *            `{ twoFactor: true }` if two-factor authentication is enabled, or the user object if not.
 *          - If unsuccessful, it returns `{ error: "Invalid fields!" }` if the provided fields are invalid,
 *            `{ error: "Email does not exist" }` if the email does not exist,
 *            `{ error: "Invalid code" }` if the two-factor authentication code is invalid,
 *            `{ error: "Code expired" }` if the two-factor authentication code has expired,
 *            `{ error: "Code does not match" }` if the two-factor authentication code does not match,
 *            `{ error: "Invalid credentials!" }` if the provided credentials are invalid,
 *            or `{ error: "Something went wrong" }` if an unknown error occurred.
 * @throws Throws an error if an error occurs during the login process.
 */
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code" };
      }

      if (twoFactorToken.expiresAt < new Date()) {
        return { error: "Code expired" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Code does not match" };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(existingUser.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    return signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    }).catch((error) => {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials!" };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    });
  } catch (error) {
    throw error;
  }
};
