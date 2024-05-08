import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { users } from "@/db/schema";

const MESSAGE = {
	REQUIRED: "必須項目です",
	STRING_MIN: "1文字以上に設定してください",
	STRING_MAX: "255文字以下に設定してください",
};

export const signUpSchema = createInsertSchema(users, {
	name: z.string().min(1, MESSAGE.STRING_MIN).max(255, MESSAGE.STRING_MAX),
	birthDate: z.string({ message: MESSAGE.REQUIRED }).date(),
	gender: z.enum(users.gender.enumValues, { message: MESSAGE.REQUIRED }),
	occupationId: z.preprocess(
		(v) => Number(v),
		z.number({ message: MESSAGE.REQUIRED }).positive(),
	),
	objectiveId: z.preprocess(
		(v) => Number(v),
		z.number({ message: MESSAGE.REQUIRED }).positive(),
	),
}).omit({ id: true, image: true, customerId: true, createdAt: true });

export type SignUpSchema = z.infer<typeof signUpSchema>;
