import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { Role } from "@prisma/client";
import { authRoutes } from "./routes";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

/**
 * This file contains the authentication logic for the User Management System.
 * It exports the `auth`, `handlers`, `signIn`, and `signOut` objects from NextAuth.
 * It also defines various callbacks and events related to authentication.
 *
 * @module auth
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  // Configuration options for the authentication module
  pages: {
    signIn: authRoutes[0], // The sign-in page route
    error: "/auth/error", // The error page route
  },

  events: {
    /**
     * Event handler for linking user accounts.
     * Updates the email verification status of the user in the database.
     *
     * @param {object} user - The user object
     */
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    /**
     * Callback function for the sign-in process.
     * Handles custom logic for sign-in with credentials provider.
     *
     * @param {object} user - The user object
     * @param {object} account - The account object
     * @returns {boolean} - Returns true if sign-in is successful, false otherwise
     */
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (user.id) {
        const existingUser = await getUserById(user.id);

        if (existingUser?.emailVerified === null) return false;

        if (existingUser?.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );
          if (!twoFactorConfirmation) {
            return false;
          }

          await db.twoFactorConfirmation.delete({
            where: {
              id: twoFactorConfirmation.id,
            },
          });
        }
      }

      return true;
    },

    /**
     * Callback function for the session creation.
     * Updates the session object with additional user information from the token.
     *
     * @param {object} token - The token object
     * @param {object} session - The session object
     * @returns {object} - The updated session object
     */
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    /**
     * Callback function for JWT token creation.
     * Updates the token object with additional user information from the database.
     *
     * @param {object} token - The token object
     * @param {object} user - The user object
     * @returns {object} - The updated token object
     */
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
      }
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser?.name;
      token.email = existingUser?.email;
      token.isTwoFactorEnabled = existingUser?.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db), // The Prisma adapter for database integration
  session: {
    strategy: "jwt", // The session strategy
  },
  ...authConfig, // Additional authentication configuration options
});
