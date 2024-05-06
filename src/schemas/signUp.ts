import { z } from "zod";

export const signUpSchema = z.object({
	name: z.string().min(1).max(255),
	birthDate: z.string().date(),
	sex: z.string(),
	occupation: z.number().positive(),
	objective: z.number().positive(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
