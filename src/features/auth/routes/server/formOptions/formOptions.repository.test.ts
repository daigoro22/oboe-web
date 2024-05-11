import { DB, prepare } from "@/db/fixture";
import FormOptionsRepository from "@/features/auth/routes/server/formOptions/formOptions.repository";
import { beforeAll, describe, expect, test } from "vitest";

describe("formOptions.repository", () => {
  let formOptionsRepository: FormOptionsRepository;
  const { occupations, objectives, setupAll } = prepare();

  beforeAll(async () => {
    await setupAll();
    formOptionsRepository = new FormOptionsRepository(DB);
  });

  test("objective が取得できる", async () => {
    const res = await formOptionsRepository.getObjectives();
    expect(res).toEqual(expect.arrayContaining(objectives()));
  });

  test("occupation が取得できる", async () => {
    const res = await formOptionsRepository.getOccupations();
    expect(res).toEqual(expect.arrayContaining(occupations()));
  });
});
