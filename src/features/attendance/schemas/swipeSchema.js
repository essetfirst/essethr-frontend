import { z } from "zod";

export const swipeSchema = z.object({
  employeeId: z.union([z.string(), z.number()]).refine(
    (v) => v !== 0 && v !== "0" && v !== "",
    "Employee is required",
  ),
  datetime: z.string().optional(),
});

export default swipeSchema;
