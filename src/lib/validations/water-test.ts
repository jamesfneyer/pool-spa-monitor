import { z } from "zod";

const optionalNumberField = z.string().optional();

export const waterTestSchema = z.object({
  poolProfileId: z.string().min(1, "Select a profile"),
  testedAt: z.string().min(1, "Test date is required"),
  freeChlorine: optionalNumberField,
  totalChlorine: optionalNumberField,
  pH: optionalNumberField,
  alkalinity: optionalNumberField,
  calciumHardness: optionalNumberField,
  cya: optionalNumberField,
  salt: optionalNumberField,
  phosphates: optionalNumberField,
  waterTemp: optionalNumberField,
  notes: z.string().optional(),
});

export type WaterTestFormValues = z.infer<typeof waterTestSchema>;
