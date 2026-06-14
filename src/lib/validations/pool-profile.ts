import { z } from "zod";

export const poolProfileSetupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  gallons: z.coerce.number().positive("Gallons must be greater than zero"),
  surfaceType: z.string().trim().min(1, "Surface type is required"),
  sanitizerType: z.string().trim().min(1, "Sanitizer type is required"),
});

export type PoolProfileSetupValues = z.infer<typeof poolProfileSetupSchema>;
