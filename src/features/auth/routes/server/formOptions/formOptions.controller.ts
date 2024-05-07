import FormOptionsRepository from "@/features/auth/routes/server/formOptions/formOptions.repository";
import FormOptionsService from "@/features/auth/routes/server/formOptions/formOptions.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { container } from "tsyringe";

export const formOptions = new Hono<Env>();
const ROUTE = "/api/signup/formOptions" as const;

const containerMiddleware = createMiddleware(async (c, next) => {
	container.register("IFormOptions", {
		useValue: new FormOptionsRepository(c.env.DB),
	});
	await next();
});

formOptions.use(ROUTE, containerMiddleware);

const formOptionsRoute = formOptions.get(ROUTE, async (c) => {
	const formOptions = container.resolve(FormOptionsService);
	const res = await formOptions.getOptions();
	return c.json(res);
});

export type FormOptionsRoute = typeof formOptionsRoute;
