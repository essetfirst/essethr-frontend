import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(255),
  lastName: z.string().trim().min(1, "Last name is required").max(255),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Must be a valid email")
    .max(255)
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Password is required").max(255),
  policy: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export default registerSchema;
