import SignUpRepository from "./signUp.repository";
import SignUpService from "./signUp.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { container } from "tsyringe";
import { signUpSchema } from "@/schemas/signUp";
import { DrizzleError } from "drizzle-orm";
import { JWT } from "@auth/core/jwt";

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
	zValidator("json", signUpSchema, async (result, c) => {
		const auth = c.get("authUser");
		const [provider, providerAccountId] = [
			"https://access.line.me", // FIXME: JWT token から取得, 他のプロバイダにも対応
			auth.token?.sub,
		];

		if (!providerAccountId) {
			return c.text("provider account not found", 400);
		}

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
				{ provider, providerAccountId },
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
