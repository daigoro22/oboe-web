import "reflect-metadata";
import UserService from "@/features/auth/routes/server/user/user.service";
import { verifySignupMiddleware } from "@/lib/middleware";
import { setFakeUserMiddleware } from "@/lib/test-helper";
import { UserFakeRepository } from "@/lib/test-helper/user";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { testClient } from "hono/testing";
import { container } from "tsyringe";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("verifySignupMiddleware", () => {
  const userContainerMiddleware = createMiddleware(async (c, next) => {
    container.register("IUser", {
      useClass: UserFakeRepository,
    });
    await next();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("ログインしていなければ401を返す", async () => {
    const app = new Hono({ strict: false });
    app.use("*", userContainerMiddleware);
    app.use("*", verifySignupMiddleware);
    const get = app.get("/", async (c) => c.text("OK", 200));
    const client = testClient<typeof get>(app);

    const res = await client.index.$get();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  test("ユーザ登録していなければ401を返す", async () => {
    const userServiceMock = vi.spyOn(UserService.prototype, "getUser");
    userServiceMock.mockResolvedValue(undefined);

    const app = new Hono({ strict: false });
    app.use("*", userContainerMiddleware);
    app.use("*", setFakeUserMiddleware);
    app.use("*", verifySignupMiddleware);
    const get = app.get("/", async (c) => c.text("OK", 200));
    const client = testClient<typeof get>(app);

    const res = await client.index.$get();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  test("ユーザが登録済みの場合、200を返す", async () => {
    const userServiceMock = vi.spyOn(UserService.prototype, "getUser");
    userServiceMock.mockResolvedValue({ id: 1, point: 10000 });

    const app = new Hono({ strict: false });
    app.use("*", userContainerMiddleware);
    app.use("*", setFakeUserMiddleware);
    app.use("*", verifySignupMiddleware);
    const get = app.get("/", async (c) => c.text("OK", 200));
    const client = testClient<typeof get>(app);

    const res = await client.index.$get();
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");

    userServiceMock.mockRestore();
  });
});
