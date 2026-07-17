import { z } from "zod";

const employeeOptionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
});

export const generatePayrunSchema = z.object({
  title: z.string().max(40, "Make your title 40 characters or less").optional().or(z.literal("")),
  employees: z.array(employeeOptionSchema).min(1, "Select at least one employee"),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
  payDate: z.string().optional(),
  payType: z.enum(["daily", "hourly"]).default("daily"),
});

export default generatePayrunSchema;
