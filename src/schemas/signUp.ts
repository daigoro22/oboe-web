import { z } from "zod";

export const signUpSchema = z.object({
	name: z.string().min(1).max(255),
	birthDate: z.string().date(),
	sex: z.string(),
	occupation: z.string(),
	objective: z.string(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
