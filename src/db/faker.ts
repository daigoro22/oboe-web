import { FAKER_SEED } from "@/lib/test-helper";
import { fakerJA } from "@faker-js/faker";

export const faker = fakerJA;

faker.seed(FAKER_SEED);
