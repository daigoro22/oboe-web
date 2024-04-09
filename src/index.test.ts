import { env } from "cloudflare:test";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { beforeAll, expect, test } from "vitest";
import { users } from "./db/schema";

let db: DrizzleD1Database;

beforeAll(async () => {
	db = drizzle(env.DATABASE);
});

test("200が返ってくる", async () => {
	const res = await db.select().from(users).all();
	expect(res).toEqual([]);
});
