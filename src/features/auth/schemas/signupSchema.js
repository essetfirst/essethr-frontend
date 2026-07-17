import { z } from "zod";

export const signupSchema = z
  .object({
    org_name: z.string().trim().min(3, "Organization name must be at least 3 characters"),
    org_email: z.string().trim().email("Enter a valid organization email"),
    org_phone: z.string().trim().min(1, "Organization phone is required"),
    org_address: z.string().trim().optional().default(""),
    firstName: z.string().trim().min(3).max(40),
    lastName: z.string().trim().min(3).max(40),
    user_email: z
      .string()
      .trim()
      .email("Enter a valid email")
      .transform((v) => v.toLowerCase()),
    password: z.string().min(6, "Password must be at least 6 characters"),
    c_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.c_password, {
    message: "Passwords must match",
    path: ["c_password"],
  });

export default signupSchema;
