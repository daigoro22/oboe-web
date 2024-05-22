import "reflect-metadata";

import SignUpService from "./signUp.service";
import { container } from "tsyringe";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { SignUpFakeRepository } from "@/lib/test-helper/signUp";
import { TEST_USER } from "@/lib/test-helper";

let signUp: SignUpService;

beforeEach(async () => {
  container.register("ISignUp", {
    useClass: SignUpFakeRepository,
  });
  signUp = container.resolve(SignUpService);
});

describe("signUp", () => {
  test("通常ケース", async () => {
    await expect(
      signUp.signUp(
        {
          name: "テスト太郎",
          birthDate: "2000-01-01",
          gender: "男",
          occupationId: 1,
          objectiveId: 1,
        },
        { sub: "TEST_SUB" },
      ),
    ).resolves.not.toThrowError();
  });

  test("provider account not found エラーケース", async () => {
    await expect(
      signUp.signUp(
        {
          name: "テスト太郎",
          birthDate: "2000-01-01",
          gender: "男",
          occupationId: 1,
          objectiveId: 1,
        },
        { sub: null }, // JWTのsubがnullの場合
      ),
    ).rejects.toThrowError("provider account not found");
  });
});

describe("isSignedUp", () => {
  test("ユーザが登録済みの場合、trueを返す", async () => {
    await expect(signUp.isSignedUp(TEST_USER)).resolves.toBe(true);
  });

  test.each([{}, { token: { sub: undefined } }])(
    "不正なユーザの場合、false を返す：%o",
    async (invalidUser) => {
      await expect(signUp.isSignedUp(invalidUser)).resolves.toBe(false);
    },
  );

  test.each([
    undefined,
    null,
    { accountId: 1, userId: undefined },
    { userId: 1, accountId: undefined },
  ])(
    "ユーザが正常だが、users もしくは accounts レコードが存在しない場合：%o",
    async (accountAndUser) => {
      container.register("ISignUp", {
        useValue: {
          getAccountAndUser: () => accountAndUser,
        },
      });
      signUp = container.resolve(SignUpService);
      await expect(signUp.isSignedUp(TEST_USER)).resolves.toBe(false);
    },
  );
});
