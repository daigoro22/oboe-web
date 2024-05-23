import { beforeAll, describe, test } from "vitest";
import { UserFakeRepository } from "@/lib/test-helper/user";
import { createMiddleware } from "hono/factory";
import { container } from "tsyringe";
import { user } from "./user.controller";
import { Hono } from "hono";
import { testClient } from "hono/testing";

const userContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("IUser", {
    useValue: new UserFakeRepository(),
  });
  await next();
});

describe("user.controller", () => {
  const app = new Hono({ strict: false });
  app.use("*", userContainerMiddleware);
  app.route("/", user);
  const client = testClient<typeof user>(app);

  test("通常ケース", async () => {});
});
