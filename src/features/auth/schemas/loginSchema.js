import { z } from "zod";

/** Mirrors @essethr/shared/schemas/auth — kept inline until shared package is fully ESM. */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email")
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export default loginSchema;
