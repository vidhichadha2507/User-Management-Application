import * as z from "zod";

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Password length must be at least 6 characters",
  }),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password is required",
  }),
});

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
