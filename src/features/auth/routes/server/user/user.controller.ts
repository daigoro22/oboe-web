import UserRepository from "./user.repository";
import UserService from "./user.service";
import type { Env } from "env";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

import { container } from "tsyringe";

const ROUTE = "/" as const

export const userContainerMiddleware = createMiddleware(async (c, next) => {
	container.register("IUser", {
		useValue: new UserRepository(c.env.DB),
	});
	await next();
});

// 以下を index.tsx に追加
// user.use(ROUTE, userContainerMiddleware);

export const user = new Hono<Env>().get(ROUTE, async (c) => {
	const user = container.resolve(UserService);
});