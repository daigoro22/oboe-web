import { applyD1Migrations, env } from "cloudflare:test";
import { readD1Migrations } from "@cloudflare/vitest-pool-workers/config";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Miniflare } from "miniflare";
import { beforeAll, describe, expect, test } from "vitest";
import { getPlatformProxy } from "wrangler";
import { users } from "./db/schema";
import type { Env } from "./db/seed";

let db: DrizzleD1Database;

beforeAll(async () => {
	db = drizzle(env.DATABASE);
});

test("200が返ってくる", async () => {
	const res = await db.select().from(users).all();
	expect(res).toEqual([]);
});
