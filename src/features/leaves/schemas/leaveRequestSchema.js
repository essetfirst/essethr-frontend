import { z } from "zod";

const durationValues = [1, 2, 3, 4];

/** @param {{ value: string }[]} leaveTypes */
export function buildLeaveRequestSchema(leaveTypes = []) {
  const allowedLeaveTypes = leaveTypes.map(({ value }) => String(value));

  return z.object({
    employeeId: z
      .string()
      .min(1, "Choose employee")
      .refine((v) => v !== "-1", "Choose employee"),
    leaveType: z
      .string()
      .min(1, "Choose a leave type")
      .refine(
        (v) => v !== "-1" && allowedLeaveTypes.includes(String(v)),
        "Choose a leave type",
      ),
    duration: z.coerce
      .number()
      .refine((v) => durationValues.includes(v), "Specify duration please"),
    from: z.string().min(1, "Specify start date of leave"),
    to: z.string().min(1, "Specify end date of leave"),
    comment: z.string().optional(),
  });
}

export default buildLeaveRequestSchema;
