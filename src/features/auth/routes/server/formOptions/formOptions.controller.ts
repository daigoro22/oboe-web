import FormOptionsRepository from "@/features/auth/routes/server/formOptions/formOptions.repository";
import FormOptionsService from "@/features/auth/routes/server/formOptions/formOptions.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { container } from "tsyringe";

export const formOptions = new Hono<Env>();

const containerMiddleware = createMiddleware(async (c, next) => {
	container.register("IFormOptions", {
		useValue: new FormOptionsRepository(c.env.DB),
	});
	await next();
});

formOptions.use("/", containerMiddleware);

formOptions.get("/", async (c) => {
	const formOptions = container.resolve(FormOptionsService);
	const res = await formOptions.getOptions();
	return c.json(res);
});
