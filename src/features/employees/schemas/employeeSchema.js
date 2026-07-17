import { z } from "zod";

const contractTypes = ["Permanent", "Temporary", "Internship"];
const genders = ["Male", "male", "female", "Female"];

/** @param {{ isCreate?: boolean }} options */
export function buildEmployeeSchema({ isCreate = true } = {}) {
  return z.object({
    employeeId: z.string().trim().min(1, "Employee id is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    surName: z.string().trim().min(1, "Sur name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    gender: z.enum(genders, { required_error: "Gender is required" }),
    birthDay: z.string().min(1, "Birth date is required"),
    nationalID: z.string().optional(),
    phone: z.string().trim().min(1, "Phone number is required"),
    phone2: z.string().optional(),
    email: z
      .string()
      .trim()
      .email("Must be a valid email")
      .max(255)
      .optional()
      .or(z.literal("")),
    address: z.string().trim().min(1, "Main address is required"),
    address2: z.string().optional(),
    cv: isCreate
      ? z.any().refine((v) => v !== "" && v != null, "CV is required")
      : z.any().optional(),
    image: z.any().optional(),
    department: z.string().min(1, "Department is required"),
    position: z.string().min(1, "Position is required"),
    salary: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number().positive("Enter valid salary figure").optional(),
    ),
    allowances: z.array(z.unknown()).default([]),
    deductions: z.array(z.unknown()).default([]),
    contractType: z.enum(contractTypes, {
      required_error: "Contract type is required",
      invalid_type_error: "Choose contract type",
    }),
    status: z.enum(["active", "inactive"], {
      required_error: "Status is required",
    }).optional(),
    startDate: z.string().min(1, "Start date is required"),
    hireDate: z.string().min(1, "Hire date is required"),
    endDate: z.string().optional(),
    isAttendanceRequired: z.boolean().default(false),
    deductCostShare: z.boolean().default(false),
    customFieldValues: z.record(z.unknown()).default({}),
  });
}

export default buildEmployeeSchema;
