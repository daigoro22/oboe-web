import { describe, expect, test, vi } from "vitest";
import { UserFakeRepository } from "@/lib/test-helper/user";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import { user } from "./user.controller";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { setFakeUserMiddleware } from "@/lib/test-helper";
import { verifySignupMiddleware } from "@/lib/middleware";
import UserService from "@/features/auth/routes/server/user/user.service";

const userContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IUser", {
    useValue: new UserFakeRepository(),
  });
  await next();
});

const app = new Hono({ strict: false });
app.use("*", setFakeUserMiddleware);
app.use("*", userContainerMiddleware);
app.use("*", verifySignupMiddleware);
app.route("/", user);
const client = testClient<typeof user>(app);

describe("/:GET", () => {
  test("通常ケース", async () => {
    const res = await client.api.auth.verified.users.$get();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ point: 10000 });
  });
});
