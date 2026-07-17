import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  location: z.string().optional(),
  parent: z.string().optional(),
});

export const positionSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  parent: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  salary: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive("Salary must be a positive figure").optional(),
  ),
  commision: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive("Commission rate must be a positive figure").optional(),
  ),
});

export const holidaySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  halfDay: z.boolean().default(false),
  inPayroll: z.boolean().default(false),
});

export const leaveTypeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  duration: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive("Duration is required"),
  ),
  color: z.string().optional(),
  allowDaysFromPast: z.boolean().default(false),
});

export default departmentSchema;
