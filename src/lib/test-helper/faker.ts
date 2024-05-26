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

export function* toIdGenerator<T extends { id: U }, U extends string | number>(
  array: T[],
  idAttrib?: keyof T,
): Generator<U, void, undefined> {
  let index = 0;
  while (true) {
    yield array[index++ % array.length][idAttrib ?? "id"];
  }
}
