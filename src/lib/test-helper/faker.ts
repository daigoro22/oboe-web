import { faker } from "@faker-js/faker";

export const FAKER_SEED = 123;
export const generateFakeObject = <T>(count: number, obj: () => T) =>
	[...Array(count)].map(obj);

export const generateFakePromise = <T>(count: number, obj: () => T) =>
	new Promise<T[]>((resolve) => resolve([...Array(count)].map(obj)));

export abstract class AbstractFakerUtil {
	constructor() {
		faker.seed(FAKER_SEED);
	}
}
