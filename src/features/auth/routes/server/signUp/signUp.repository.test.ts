import { DB, prepare, testDB } from "@/db/fixture";
import SignUpRepository from "./signUp.repository";
import { beforeAll, describe, expect, test } from "vitest";
import { accounts, users } from "@/db/schema";
import { desc } from "drizzle-orm";

let signUpRepository: SignUpRepository;
const { setupAll, users: userFixtures, accounts: accountFixtures } = prepare();

beforeAll(async () => {
  await setupAll();
  signUpRepository = new SignUpRepository(DB);
});

describe("signUp", () => {
  test("通常ケース", async () => {
    const targetUser = {
      name: "テスト太郎",
      birthDate: new Date("2000-01-01"),
      gender: "男",
      occupationId: 1,
      objectiveId: 1,
      customerId: "1234567890",
      image: "https://example.com/test_image.jpg",
      point: 100,
    } as const;

    const targetProvider = {
      provider: "https://access.line.me",
      providerAccountId: "TEST_SUB",
    };

    await expect(
      signUpRepository.signUp(targetUser, targetProvider),
    ).resolves.not.toThrowError();

    const { createdAt: _, ...userRecords } = (
      await testDB.select().from(users).orderBy(desc(users.id)).limit(1)
    )[0];
    const { createdAt: __, ...accountRecords } = (
      await testDB.select().from(accounts).orderBy(desc(accounts.id)).limit(1)
    )[0];

    expect(userRecords).toEqual({ id: 11, ...targetUser });
    expect(accountRecords).toEqual({
      id: 11,
      userId: userRecords.id,
      ...targetProvider,
    });
  });

  test.each([
    {
      name: "nameが null",
      data: {
        name: null,
        birthDate: new Date("2000-01-01"),
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
        customerId: "1234567890",
        image: "https://example.com/test_image.jpg",
      },
    },
    {
      name: "occupationIdが存在しないID",
      data: {
        name: "テスト太郎",
        birthDate: new Date("2000-01-01"),
        gender: "男",
        occupationId: -1,
        objectiveId: 1,
        customerId: "1234567890",
        image: "https://example.com/test_image.jpg",
      },
    },
    {
      name: "objectiveIdが存在しないID",
      data: {
        name: "テスト太郎",
        birthDate: new Date("2000-01-01"),
        gender: "男",
        occupationId: 1,
        objectiveId: -1,
        customerId: "1234567890",
        image: "https://example.com/test_image.jpg",
      },
    },
    {
      name: "customerIdが null",
      data: {
        name: "テスト太郎",
        birthDate: new Date("2000-01-01"),
        gender: "男",
        occupationId: 1,
        objectiveId: 1,
        customerId: null,
        image: "https://example.com/test_image.jpg",
      },
    },
  ])("$name", async ({ data: invalidUser }) => {
    await expect(
      signUpRepository.signUp(invalidUser, {
        provider: "https://access.line.me",
        providerAccountId: "TEST_SUB",
      }),
    ).rejects.toThrowError();
  });

  test("同じ providerAccountId での複数回登録はエラーになること", async () => {
    const duplicateUser = {
      name: "テスト二郎",
      birthDate: new Date("1990-05-05"),
      gender: "男",
      occupationId: 2,
      objectiveId: 2,
      customerId: "0987654321",
      image: "https://example.com/another_test_image.jpg",
    };

    // 最初の登録は成功する
    await expect(
      signUpRepository.signUp(duplicateUser, {
        provider: "https://access.line.me",
        providerAccountId: "DUPLICATE_TEST_SUB",
      }),
    ).resolves.not.toThrowError();

    // 同じ providerAccountId で再登録を試みる
    await expect(
      signUpRepository.signUp(duplicateUser, {
        provider: "https://access.line.me",
        providerAccountId: "DUPLICATE_TEST_SUB",
      }),
    ).rejects.toThrowError();
  });
});
