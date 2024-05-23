import "reflect-metadata";

import { signUp } from "@/features/auth/routes/server/signUp/signUp.controller";
import { SignUpFakeRepository } from "@/lib/test-helper/signUp";
import type { AuthUser } from "@hono/auth-js";
import { createMiddleware } from "hono/factory";
import { testClient } from "hono/testing";
import { container } from "tsyringe";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Hono } from "hono";
import SignUpService from "@/features/auth/routes/server/signUp/signUp.service";
import { DrizzleError } from "drizzle-orm";
import { setFakeUserMiddleware } from "@/lib/test-helper";

beforeEach(() => {
  container.clearInstances();
});

const signUpContainerMiddleware = createMiddleware(async (c, next) => {
  container.register("ISignUp", {
    useValue: new SignUpFakeRepository(),
  });
  await next();
});

describe("signUp.controller", () => {
  const app = new Hono({ strict: false });
  app.use("*", setFakeUserMiddleware);
  app.use("*", signUpContainerMiddleware);
  app.route("/", signUp);
  const client = testClient<typeof signUp>(app);

  test("controller が正常に呼び出されるかどうか", async () => {
    const res = await client.api.auth.signup.$post({
      json: {
        name: "テスト太郎",
        birthDate: "2000-01-01",
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
      },
    });

    expect(res.status).toEqual(201);
  });

  test("スキーマバリデーションに失敗した場合、400エラーが返されること", async () => {
    const res = await client.api.auth.signup.$post({
      json: {
        name: "テスト太郎",
        birthDate: "2000-01-01",
        gender: "不明", // genderの値が不正
        occupationId: 1,
        objectiveId: 1,
      },
    });
    expect(res.status).toEqual(400);
  });

  test("SignUpからDrizzleErrorが返された場合、500エラーが返されること", async () => {
    // SignUpServiceのsignUpメソッドをモック
    const signUpMock = vi.spyOn(SignUpService.prototype, "signUp");
    signUpMock.mockImplementation(() => {
      throw new DrizzleError({ message: "Drizzle Error" });
    });

    const res = await client.api.auth.signup.$post({
      json: {
        name: "テスト太郎",
        birthDate: "2000-01-01",
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
      },
    });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual({ error: "cannot create user data" });

    signUpMock.mockRestore();
  });

  test("SignUpからserver errorが返された場合、500エラーが返されること", async () => {
    // SignUpServiceのsignUpメソッドをモック
    const signUpMock = vi.spyOn(SignUpService.prototype, "signUp");
    signUpMock.mockImplementation(() => {
      throw new Error("Server Error");
    });

    const res = await client.api.auth.signup.$post({
      json: {
        name: "テスト太郎",
        birthDate: "2000-01-01",
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
      },
    });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual({ error: "server error" });

    signUpMock.mockRestore();
  });

  test.each([
    {
      name: "必須フィールドが欠けている場合",
      data: {
        name: "テスト太郎",
        birthDate: "2000-01-01",
        gender: "男",
        // occupationIdが欠けている
        objectiveId: 1,
      },
    },
    {
      name: "無効な日付フォーマットの場合",
      data: {
        name: "テスト太郎",
        birthDate: "2000/01/01", // 無効な日付フォーマット
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
      },
    },
    {
      name: "未来の日付の場合",
      data: {
        name: "テスト太郎",
        birthDate: "3000-01-01", // 未来の日付
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
      },
    },
    {
      name: "無効な性別の値の場合",
      data: {
        name: "テスト太郎",
        birthDate: "2000-01-01",
        gender: "TEST", // 無効な性別の値
        occupationId: 1,
        objectiveId: 1,
      },
    },
    {
      name: "occupationIdとobjectiveIdが負の値の場合",
      data: {
        name: "テスト太郎",
        birthDate: "2000-01-01",
        gender: "男",
        occupationId: -1, // 負の値
        objectiveId: -1, // 負の値
      },
    },
  ])("スキーマバリデーションのエッジケース: $name", async ({ data }) => {
    const res = await client.api.auth.signup.$post({ json: data });
    expect(res.status).toEqual(400);
  });
});
