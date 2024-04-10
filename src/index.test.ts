import { beforeAll, expect, test } from "vitest";
import { setupAll, testDB } from "./db/fixture";
import { occupations } from "./db/schema";

beforeAll(async () => {
	await setupAll();
});

test("DB読み込みができる", async () => {
	const res = await testDB.select().from(occupations).all();
	expect(res.length).toEqual(10);
});
