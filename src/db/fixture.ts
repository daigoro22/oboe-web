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
} from "./schema";

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

	const setupAll = async () => {
		occupations = await setupOccupations();
		objectives = await setupObjectives();
	};

	return {
		occupations: () => occupations,
		objectives: () => objectives,
		setupOccupations,
		setupObjectives,
		setupAll,
	};
};
