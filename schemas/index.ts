import { Role } from "@prisma/client";
import * as z from "zod";

/**
 * Represents the settings schema for user management.
 */
export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([Role.ADMIN, Role.USER, Role.MANAGER]),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );

/**
 * Represents the schema for resetting a password.
 */
export const ResetSchema = z.object({
  /**
   * The email address of the user.
   * @remarks The email must be a valid email address.
   */
  email: z.string().email({
    message: "Password length must be at least 6 characters",
  }),
});
/**
 * Represents the schema for a new password.
 */
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password is required",
  }),
});

/**
 * Represents the login schema for user authentication.
 */
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(
    z.string().min(6, {
      message: "Code is required",
    })
  ),
});

/**
 * Represents the schema for user registration.
 */
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password length must be at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

/**
 * Represents the schema for an organization.
 */
export const OrganizationSchema = z.object({
  /**
   * The name of the organization.
   * @remarks This field is required.
   */
  name: z.string().min(1, {
    message: "Name is required",
  }),

  /**
   * The email of the organization.
   * @remarks This field is optional.
   */
  email: z.optional(z.string()),
});
