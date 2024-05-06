import SignUpRepository from "./signUp.repository";
import SignUpService from "./signUp.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { container } from "tsyringe";

export const signUp = new Hono<Env>();

const containerMiddleware = createMiddleware(async (c, next) => {
	container.register("ISignUp", {
		useValue: new SignUpRepository(c.env.DB),
	});
	await next();
});

signUp.use("/", containerMiddleware);

signUp.post("/", async (c) => {
	const signUp = container.resolve(SignUpService);
	console.log(await c.req.json());
	return c.text("success");
});
