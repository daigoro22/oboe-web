import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { beforeAll, describe, expect, test } from "vitest";
import { getPlatformProxy } from "wrangler";
import { users } from "./db/schema";
import type { Env } from "./db/seed";

let db: DrizzleD1Database;

beforeAll(async () => {
	const { env } = await getPlatformProxy<Env>();
	db = drizzle(env.DB);
});

test("200が返ってくる", async () => {
	const res = await db.select().from(users).all();
	expect(res).toEqual([]);
});
