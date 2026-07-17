import { z } from "zod";

export const registerAttendanceSchema = z.object({
  employee: z
    .string()
    .min(1, "Select an employee")
    .refine((v) => v !== "none", "Please select employee"),
});

export default registerAttendanceSchema;
