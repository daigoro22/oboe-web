import SignUpRepository from "./signUp.repository";
import SignUpService from "./signUp.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { container } from "tsyringe";
import { signUpSchema } from "@/schemas/signUp";
import { DrizzleError } from "drizzle-orm";

const ROUTE = "/api/signup" as const;

export const signUpContainerMiddleware = createMiddleware(async (c, next) => {
	container.register("ISignUp", {
		useValue: new SignUpRepository(c.env.DB),
	});
	await next();
});

export const signUp = new Hono<Env>().post(
	ROUTE,
	zValidator("json", signUpSchema, async (result, c) => {
		const auth = c.get("authUser");

		const { success, data } = result;

		if (!success) {
			return c.json(result.error, 400);
		}

		const signUp = container.resolve(SignUpService);
		try {
			await signUp.signUp(
				{
					...data,
					birthDate: new Date(data.birthDate),
					customerId: String(new Date().getTime()), //TODO: Stripe API を使用して ID を取得
					image: auth.session.user?.image,
				},
				auth?.token,
			);
		} catch (e) {
			if (e instanceof DrizzleError) {
				return c.json({ error: "cannot create user data" }, 500);
			}
			console.log(e);
			return c.json({ error: "server error" }, 500);
		}

		return c.text("success", 200);
	}),
);
