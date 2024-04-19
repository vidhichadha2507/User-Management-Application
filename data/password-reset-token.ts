import { db } from "@/lib/db";

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    console.log("lib ->", passwordToken);

    return passwordToken;
  } catch (error) {
    console.log("lib ->", error);

    return null;
  }
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return passwordToken;
  } catch (error) {
    return null;
  }
};
