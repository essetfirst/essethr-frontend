import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  logo: z.string().optional(),
  branch: z.string().optional(),
  phone: z.string().trim().min(1, "Phone is required"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  address: z.string().trim().min(1, "Address is required"),
});

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
});

export const allocateAllowanceSchema = z.object({
  employeeId: z.union([z.string(), z.number()]).refine(
    (v) => v !== -1 && v !== "-1" && v !== "",
    "Employee is required",
  ),
});

export const branchSchema = z.object({
  branch: z.string().trim().min(1, "Branch name is required"),
  phone: z.string().optional(),
  address: z
    .object({
      city: z.string().optional(),
      region: z.string().optional(),
    })
    .optional()
    .default({ city: "" }),
});

export const generateReportSchema = z.object({
  reportType: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  dateRange: z.string().min(1, "Date range is required"),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  month: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
});

/** @param {{ value: unknown }[]} employeeOptions @param {{ value: unknown }[]} leaveTypeOptions */
export function buildLeaveFormSchema(employeeOptions = [], leaveTypeOptions = []) {
  const employeeIds = employeeOptions
    .filter((o) => o.value !== -1)
    .map((o) => String(o.value));
  const leaveTypeIds = leaveTypeOptions
    .filter((o) => o.value !== -1)
    .map((o) => String(o.value));

  return z.object({
    employeeId: z.union([z.string(), z.number()]).refine(
      (v) => employeeIds.includes(String(v)),
      "Choose employee",
    ),
    leaveType: z.union([z.string(), z.number()]).refine(
      (v) => leaveTypeIds.includes(String(v)),
      "Choose a valid leave type",
    ),
    startDate: z.string().min(1, "Specify start date of leave"),
    endDate: z.string().min(1, "Specify end date of leave"),
    comment: z.string().optional(),
  });
}

export default createOrgSchema;
