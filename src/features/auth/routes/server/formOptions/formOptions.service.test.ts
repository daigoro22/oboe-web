import "reflect-metadata";

import FormOptionsService, {
  type IFormOptions,
} from "@/features/auth/routes/server/formOptions/formOptions.service";
import { AbstractFakerUtil, generateFakePromise } from "@/lib/test-helper";
import { faker } from "@/db/faker";
import { container } from "tsyringe";
import { beforeAll, describe, expect, test } from "vitest";

let formOptions: FormOptionsService;

class fakeRepository extends AbstractFakerUtil implements IFormOptions {
  async getOccupations() {
    return await generateFakePromise(3, () => ({
      id: faker.number.int({ min: 0, max: 100 }),
      name: faker.person.jobTitle(),
    }));
  }
  async getObjectives() {
    return await generateFakePromise(3, () => ({
      id: faker.number.int({ min: 0, max: 100 }),
      name: faker.word.noun(5),
    }));
  }
}

beforeAll(async () => {
  container.register("IFormOptions", {
    useClass: fakeRepository,
  });
  formOptions = container.resolve(FormOptionsService);
});

describe("formOptions.service", () => {
  test("選択肢が取得できる", async () => {
    const res = await formOptions.getOptions();
    expect(res).toEqual({
      objectives: [
        {
          id: 65,
          name: "north",
        },
        {
          id: 3,
          name: "grasp",
        },
        {
          id: 76,
          name: "plane",
        },
      ],
      occupations: [
        {
          id: 24,
          name: "Future Assurance Coordinator",
        },
        {
          id: 35,
          name: "Investor Response Orchestrator",
        },
        {
          id: 100,
          name: "Chief Program Representative",
        },
      ],
    });
  });
});
