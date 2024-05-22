import { faker } from "@/db/faker";
import type { AuthUser } from "@hono/auth-js";
import { createMiddleware } from "hono/factory";

export * from "./faker";

export const TESTING_TIME = new Date("2024-01-01");

export const TEST_USER: AuthUser = {
  session: {
    expires: String(new Date().getTime() / 1000 + 60 * 60 * 24),
    user: { id: faker.string.nanoid(), image: "TEST_IMAGE_URL" },
  },
  token: { sub: "TEST_SUB" },
};

export const setFakeUserMiddleware = createMiddleware(async (c, next) => {
  c.set("authUser", TEST_USER);
  await next();
});
