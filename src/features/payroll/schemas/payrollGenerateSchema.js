import { z } from "zod";

const employeeOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const payrollGenerateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(40, "Title must be at most 40 characters"),
  fromDate: z.string().min(1, "Start date is required"),
  toDate: z.string().min(1, "End date is required"),
  payDate: z.string().optional(),
  payType: z.enum(["daily", "hourly"], {
    errorMap: () => ({ message: "Payment unit can only be daily or hourly" }),
  }),
  employees: z
    .array(employeeOptionSchema)
    .min(1, "At least one employee is required"),
  onlyApprovedHours: z.boolean().default(false),
  commissionEnabled: z.boolean().default(false),
  salesData: z.array(z.unknown()).default([]),
});

export default payrollGenerateSchema;
