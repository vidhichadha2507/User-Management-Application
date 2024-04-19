"use server";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import * as z from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log({ ReceivedValues: values });

  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

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

  try {
    return signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    }).catch((error) => {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            console.log("Testing");
            return { error: "Invalid credentials!" };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
