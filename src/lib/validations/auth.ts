import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password is required"),
});

export type LoginFormData =
  z.infer<typeof loginSchema>;

export const registerSchema =
  z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters"),

      email: z.email(
        "Enter a valid email address"
      ),

      password: z
        .string()
        .min(
          8,
          "Password must be at least 8 characters"
        ),

      confirmPassword: z.string(),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );

export type RegisterFormData =
  z.infer<typeof registerSchema>;
