import SignUpService from "@/features/auth/routes/server/signUp/signUp.service";
import { verifySignupMiddleware } from "@/lib/middleware";
import { setFakeUserMiddleware } from "@/lib/test-helper";
import { SignUpFakeRepository } from "@/lib/test-helper/signUp";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { testClient } from "hono/testing";
import { container } from "tsyringe";
import { describe, expect, test, vi } from "vitest";

describe("verifySignupMiddleware", () => {
  const signUpContainerMiddleware = createMiddleware(async (c, next) => {
    container.register("ISignUp", {
      useValue: new SignUpFakeRepository(),
    });
    await next();
  });

  test("ログインしていなければ401を返す", async () => {
    const app = new Hono({ strict: false });
    app.use("*", verifySignupMiddleware);
    const get = app.get("/", async (c) => c.text("OK", 200));
    const client = testClient<typeof get>(app);

    const res = await client.index.$get();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  test("ユーザ登録していなければ401を返す", async () => {
    const signUpServiceMock = vi.spyOn(SignUpService.prototype, "isSignedUp");
    signUpServiceMock.mockResolvedValue(false);

    const app = new Hono({ strict: false });
    app.use("*", signUpContainerMiddleware);
    app.use("*", setFakeUserMiddleware);
    app.use("*", verifySignupMiddleware);
    const get = app.get("/", async (c) => c.text("OK", 200));
    const client = testClient<typeof get>(app);

    const res = await client.index.$get();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  test("ユーザが登録済みの場合、200を返す", async () => {
    const signUpServiceMock = vi.spyOn(SignUpService.prototype, "isSignedUp");
    signUpServiceMock.mockResolvedValue(true);

    const app = new Hono({ strict: false });
    app.use("*", signUpContainerMiddleware);
    app.use("*", setFakeUserMiddleware);
    app.use("*", verifySignupMiddleware);
    const get = app.get("/", async (c) => c.text("OK", 200));
    const client = testClient<typeof get>(app);

    const res = await client.index.$get();
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");

    signUpServiceMock.mockRestore();
  });
});
