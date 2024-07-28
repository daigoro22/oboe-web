import { customLogger } from "@/lib/logger";
import UserRepository from "./user.repository";
import UserService from "./user.service";
import type { Context, Env } from "env";
import { Hono } from "hono";
import { createFactory, createMiddleware } from "hono/factory";

import { container } from "tsyringe";

export const ROUTE = "/api/auth/verified/users" as const;

export const userContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IUser", {
    useValue: new UserRepository(c.env.DB),
  });
  await next();
});

const factory = createFactory();
const indexGet = factory.createHandlers(async (c: Context) => {
  const { point } = c.get("userData");
  return c.json({
    point,
  });
});

// 以下を index.tsx に追加
// user.use(ROUTE, userContainerMiddleware);

export const user = new Hono<Env>().basePath(ROUTE).get("/", ...indexGet);
export type UsersRoute = typeof user;
