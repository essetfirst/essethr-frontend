import { z } from "zod";

export const branchTransferSchema = z.object({
  destinationOrg: z.string().min(1, "Pick a destination branch"),
  destinationDepartment: z.string().min(1, "Choose a department in the new branch"),
  destinationPosition: z.string().min(1, "Choose a position in the new branch"),
});

export default branchTransferSchema;
