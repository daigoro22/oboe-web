import { env } from "cloudflare:test";
import type { InferInsertModel, Table, TableConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { faker } from "./faker";
import { occupations } from "./schema";

export const testDB = drizzle(env.DATABASE);
export const FAKER_SEED = 123;
const DEFAULT_COUNT = 10;

export function createFixtures<
	U extends InferInsertModel<Table<T>>,
	T extends TableConfig = TableConfig,
>(schema: Table<T>, object: () => U, count: number) {
	return testDB.insert(schema).values([...Array(count)].map(object));
}

export const setupOccupations = (count = DEFAULT_COUNT) =>
	createFixtures(
		occupations,
		() => ({
			name: faker.person.jobTitle(),
		}),
		count,
	);

export const setupAll = async () => {
	faker.seed(FAKER_SEED);
	return { occupations: await setupOccupations() };
};
