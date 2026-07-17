import { z } from "zod";

export const payrunDialogSchema = z.object({
  employeeSelect: z.string().optional(),
  department: z.string().optional(),
  period: z.string().optional(),
  from: z.any().nullable().optional(),
  to: z.any().nullable().optional(),
});

export default payrunDialogSchema;
