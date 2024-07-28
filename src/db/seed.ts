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
import { type Card, createEmptyCard } from "ts-fsrs";
import Stripe from "stripe";

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
    customerId: null,
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

  const customer = await stripeCustomers();
  usersData[0].customerId = customer?.id ?? "";

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

  const latLngs = [
    { lat: 35.740103681433425, lng: 139.74128675902182 },
    { lat: 35.74041153976215, lng: 139.74129831769412 },
    { lat: 35.74032036273507, lng: 139.74161877536605 },
    { lat: 35.7402025919986, lng: 139.74195354223124 },
  ];

  const lats = toIdGenerator(latLngs, "lat");
  const lngs = toIdGenerator(latLngs, "lng");

  await createSeeds(
    cards,
    () => {
      const {
        elapsed_days: elapsedDays,
        scheduled_days: scheduledDays,
        ...rest
      }: Card = createEmptyCard();

      return {
        deckId: deckFixtures[0].id,
        number: faker.number.int({ min: 1, max: 100 }),
        publicId: faker.string.nanoid(),
        frontContent: faker.lorem.sentence(),
        backContent: faker.lorem.sentence(),
        lat: Number(lats.next().value),
        lng: Number(lngs.next().value),
        pitch: faker.number.float({ min: -90, max: 90 }),
        heading: faker.number.float({ min: 0, max: 360 }),
        elapsedDays,
        scheduledDays,
        ...rest,
      };
    },
    4,
    db,
  );
  await stripeProducts();
  console.log("finish");
  process.exit();
}
const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

const stripeProducts = async () => {
  const prices = await stripe.prices.list({ limit: 100 });
  const productIds = [faker.string.nanoid(), faker.string.nanoid()];
  if (prices.data.some(({ product }) => productIds.includes(String(product)))) {
    console.log("product already exists");
    return;
  }

  await stripe.products.create({
    name: "ポイントパック（500 pt）",
    id: productIds[0],
    default_price_data: {
      currency: "jpy",
      unit_amount: 500,
    },
  });
  await stripe.products.create({
    name: "ポイントパック（1000 pt）",
    id: productIds[1],
    default_price_data: {
      currency: "jpy",
      unit_amount: 1000,
    },
  });
  console.log("products created");
};

const stripeCustomers = async () => {
  const customers = await stripe.customers.list();

  if (customers.data.some(({ email }) => email === "taro.yamada@example.com")) {
    console.log("customer already exists");
    return customers.data.find(
      ({ email }) => email === "taro.yamada@example.com",
    );
  }

  const customer = await stripe.customers.create({
    email: "taro.yamada@example.com",
    name: usersData[0].name,
  });
  return customer;
};

main();
