import SignUpRepository from "./signUp.repository";
import SignUpService from "./signUp.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { container } from "tsyringe";
import { signUpSchema } from "@/schemas/signUp";

export const signUp = new Hono<Env>();

const containerMiddleware = createMiddleware(async (c, next) => {
	container.register("ISignUp", {
		useValue: new SignUpRepository(c.env.DB),
	});
	await next();
});

signUp.use("/", containerMiddleware);

signUp.post(
	"/",
	zValidator("json", signUpSchema, (result, c) => {
		const { success, data } = result;
		if (!success) {
			console.log(result);
			return c.json(result.error, 400);
		}

		console.log(data);
		return c.json(data, 200);
	}),
);
