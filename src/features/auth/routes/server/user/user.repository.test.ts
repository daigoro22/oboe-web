import { DB, prepare } from "@/db/fixture";
import UserRepository from "./user.repository";
import { beforeAll, describe, expect, test } from "vitest";

describe("user.repository", () => {
  let userRepository: UserRepository;
  const { setupAll, accounts, users } = prepare();

  beforeAll(async () => {
    await setupAll();
    userRepository = new UserRepository(DB);
  });

  test("通常ケース", async () => {
    const targetAccount = accounts()[0];
    const user = await userRepository.getUser(targetAccount.providerAccountId);
    expect(user).toEqual(users()[0]);
  });

  test("providerAccountId が不正なケース", async () => {
    const invalidProviderAccountId = "invalid-id";
    const user = await userRepository.getUser(invalidProviderAccountId);
    expect(user).toBeUndefined();
  });
});
