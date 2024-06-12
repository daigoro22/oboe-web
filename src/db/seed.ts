import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { getPlatformProxy } from "wrangler";
import {
  accounts,
  ankiSessions,
  cards,
  decks,
  objectives,
  occupations,
  users,
} from "./schema";
import { FAKER_SEED, toIdGenerator } from "@/lib/test-helper";
import { faker } from "@/db/faker";
import type { InferInsertModel, Table, TableConfig } from "drizzle-orm";
import { generateFakeObject } from "@/lib/test-helper";
import { PROVIDER } from "@/lib/constant";

export function createSeeds<
  U extends InferInsertModel<Table<T>>,
  T extends TableConfig = TableConfig,
>(schema: Table<T>, object: () => U, count: number, DB: DrizzleD1Database) {
  return DB.insert(schema)
    .values(generateFakeObject(count, object))
    .returning();
}

export interface Env {
  DB: D1Database;
}
const usersData: (typeof users.$inferInsert)[] = [
  {
    id: 1,
    name: "山田太郎",
    image: "https://source.boringavatars.com/beam/100/yamada",
    birthDate: new Date("1990-01-01"),
    gender: "男",
    occupationId: 1,
    objectiveId: 1,
    customerId: "yamada_taro",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "鈴木花子",
    image: "https://source.boringavatars.com/beam/100/suzuki",
    birthDate: new Date("1995-05-05"),
    gender: "女",
    occupationId: 2,
    objectiveId: 2,
    customerId: "suzuki_hanako",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "佐藤次郎",
    image: "https://source.boringavatars.com/beam/100/sato",
    birthDate: new Date("1985-12-10"),
    gender: "男",
    occupationId: 3,
    objectiveId: 3,
    customerId: "sato_jiro",
    createdAt: new Date(),
  },
];

const occupationsData: (typeof occupations.$inferInsert)[] = [
  { id: 1, name: "経営者・役員" },
  { id: 2, name: "会社員（正社員）" },
  { id: 3, name: "会社員（契約社員）" },
  { id: 4, name: "会社員（派遣社員）" },
  { id: 5, name: "パート・アルバイト" },
  { id: 6, name: "公務員" },
  { id: 7, name: "自営業" },
  { id: 8, name: "自由業" },
  { id: 9, name: "専業主婦・主夫" },
  { id: 10, name: "大学生・大学院生" },
  { id: 11, name: "専門学校生・短大生" },
  { id: 12, name: "高校生" },
  { id: 13, name: "中学生" },
  { id: 14, name: "小学生" },
  { id: 15, name: "医師" },
  { id: 16, name: "士業（公認会計士・弁護士・税理士・司法書士）" },
  { id: 17, name: "NGO・NPO法人職員" },
  { id: 18, name: "家事手伝い" },
  { id: 19, name: "無職" },
  { id: 20, name: "定年退職" },
];

const objectivesData: (typeof objectives.$inferInsert)[] = [
  { id: 1, name: "資格試験" },
  { id: 2, name: "受験" },
  { id: 3, name: "日々の学業" },
  { id: 4, name: "日々の業務" },
  { id: 5, name: "趣味" },
  { id: 6, name: "その他" },
];

async function main() {
  console.log("start");
  const { env } = await getPlatformProxy<Env>();
  faker.seed(FAKER_SEED);
  const db = drizzle(env.DB);
  await db.delete(ankiSessions);
  await db.delete(cards);
  await db.delete(decks);
  await db.delete(accounts);
  await db.delete(users);
  await db.delete(occupations);
  await db.delete(objectives);

  await db.insert(objectives).values(objectivesData);
  await db.insert(occupations).values(occupationsData);
  await db.insert(users).values(usersData).returning();
  await db
    .insert(accounts)
    .values([
      {
        userId: 1,
        provider: PROVIDER.LINE,
        providerAccountId: import.meta.env.VITE_LINE_DEV_USER_ID,
      },
    ])
    .returning();

  const deckUserId = toIdGenerator(usersData);
  const deckFixtures = await createSeeds(
    decks,
    () => ({
      userId: Number(deckUserId.next().value),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      publicId: faker.string.nanoid(),
    }),
    3,
    db,
  );

  const sessionUserId = toIdGenerator(usersData);
  const sessionDeckId = toIdGenerator(deckFixtures, "publicId");
  await createSeeds(
    ankiSessions,
    () => ({
      userId: Number(sessionUserId.next().value),
      deckPublicId: String(sessionDeckId.next().value),
      startsAt: new Date(),
      endsAt: null,
      publicId: faker.string.nanoid(),
    }),
    3,
    db,
  );

  const cardDeckId = toIdGenerator(deckFixtures);
  await createSeeds(
    cards,
    () => ({
      deckId: Number(cardDeckId.next().value),
      number: faker.number.int({ min: 1, max: 100 }),
      publicId: faker.string.nanoid(),
      frontContent: faker.lorem.sentence(),
      backContent: faker.lorem.sentence(),
      stability: faker.number.float({ min: 0.0, max: 1.0 }),
      difficulty: faker.number.float({ min: 0.0, max: 1.0 }),
      due: faker.date.future(),
      elapsedDays: faker.number.int({ min: 0, max: 365 }),
      scheduledDays: faker.number.int({ min: 1, max: 365 }),
      reps: faker.number.int({ min: 0, max: 1000 }),
      lapses: faker.number.int({ min: 0, max: 100 }),
      state: faker.helpers.arrayElement(["New", "Learning", "Review"]),
      lastReview: faker.date.past(),
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
      pitch: faker.number.float({ min: -90, max: 90 }),
      heading: faker.number.float({ min: 0, max: 360 }),
    }),
    3,
    db,
  );
  console.log("finish");
  process.exit();
}

main();
