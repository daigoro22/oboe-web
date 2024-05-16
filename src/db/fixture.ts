import { env } from "cloudflare:test";
import { FAKER_SEED, generateFakeObject } from "@/lib/test-helper";
import type {
  InferInsertModel,
  InferSelectModel,
  Table,
  TableConfig,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { faker } from "./faker";
import {
  objectives as _objectives,
  occupations as _occupations,
  users as _users,
  accounts as _accounts,
} from "./schema";
import { PROVIDER } from "@/lib/constant";

export const DB = env.DATABASE;
export const testDB = drizzle(env.DATABASE);
const DEFAULT_COUNT = 10;

export function createFixtures<
  U extends InferInsertModel<Table<T>>,
  T extends TableConfig = TableConfig,
>(schema: Table<T>, object: () => U, count: number) {
  return testDB
    .insert(schema)
    .values(generateFakeObject(count, object))
    .returning();
}

export const prepare = () => {
  faker.seed(FAKER_SEED);

  let objectives: InferSelectModel<typeof _objectives>[];
  const setupOccupations = (count = DEFAULT_COUNT) =>
    createFixtures(
      _occupations,
      () => ({
        name: faker.person.jobTitle(),
      }),
      count,
    );

  let occupations: InferSelectModel<typeof _occupations>[];
  const setupObjectives = (count = DEFAULT_COUNT) =>
    createFixtures(
      _objectives,
      () => ({
        name: faker.word.noun(5),
      }),
      count,
    );

  let users: InferSelectModel<typeof _users>[];
  const setupUsers = (count = DEFAULT_COUNT) =>
    createFixtures(
      _users,
      () => ({
        name: faker.person.firstName(),
        birthDate: faker.date.recent({ days: 30 }),
        gender: faker.helpers.arrayElement([
          "男",
          "女",
          "その他",
          "無回答",
        ] as typeof _users.gender.enumValues),
        occupationId: faker.helpers.arrayElement(occupations.map((o) => o.id)),
        objectiveId: faker.helpers.arrayElement(objectives.map((o) => o.id)),
        customerId: faker.string.nanoid(),
      }),
      count,
    );

  let accounts: InferSelectModel<typeof _accounts>[];
  const setupAccounts = (count = DEFAULT_COUNT) =>
    createFixtures(
      _accounts,
      () => ({
        userId: faker.helpers.arrayElement(users.map((u) => u.id)),
        provider: PROVIDER.LINE,
        providerAccountId: faker.string.nanoid(),
      }),
      count,
    );

  const setupAll = async () => {
    occupations = await setupOccupations();
    objectives = await setupObjectives();
    users = await setupUsers();
    accounts = await setupAccounts();
  };

  return {
    occupations: () => occupations,
    objectives: () => objectives,
    users: () => users,
    accounts: () => accounts,
    setupOccupations,
    setupObjectives,
    setupUsers,
    setupAccounts,
    setupAll,
  };
};
