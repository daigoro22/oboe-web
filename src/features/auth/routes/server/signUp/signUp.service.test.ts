import "reflect-metadata";

import SignUpService from "./signUp.service";
import { container } from "tsyringe";
import { beforeAll, describe, expect, test } from "vitest";
import { SignUpFakeRepository } from "@/lib/test-helper/signUp";

let signUp: SignUpService;

beforeAll(async () => {
  container.register("ISignUp", {
    useClass: SignUpFakeRepository,
  });
  signUp = container.resolve(SignUpService);
});

describe("signUp.service", () => {
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
