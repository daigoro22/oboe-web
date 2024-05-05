import { beforeAll, expect, test } from "vitest";
import { prepare, testDB } from "./db/fixture";
import { occupations } from "./db/schema";

const { setupAll } = prepare();

beforeAll(async () => {
	await setupAll();
});

test("DB読み込みができる", async () => {
	const res = await testDB.select().from(occupations).all();
	expect(res.length).toEqual(10);
});
