import { z } from "zod";

export const editAttendanceSchema = z.object({
  employee: z.string().optional(),
  checkin: z.string().optional(),
  checkout: z.string().optional(),
  status: z.string().optional(),
  date: z.any().optional(),
});

export default editAttendanceSchema;
