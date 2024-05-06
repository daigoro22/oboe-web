import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { users } from "@/db/schema";

export const signUpSchema = createInsertSchema(users, {
	name: z.string().min(1).max(255),
	birthDate: z.string().date(),
	occupationId: z.preprocess((v) => Number(v), z.number().positive()),
	objectiveId: z.preprocess((v) => Number(v), z.number().positive()),
}).omit({ id: true, image: true, customerId: true, createdAt: true });

export type SignUpSchema = z.infer<typeof signUpSchema>;
