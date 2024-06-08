import { DB, testDB, prepare } from "@/db/fixture";
import { objectives, occupations } from "@/db/schema";
import { Transaction } from "@/lib/transaction";
import { beforeAll, describe, expect, test } from "vitest";

describe("transaction", () => {
  const {
    setupAll,
    objectives: objFixture,
    occupations: occFixture,
  } = prepare();

  beforeAll(async () => {
    await setupAll();
  });

  test("通常ケース", async () => {
    const tx = new Transaction(DB);
    await tx.transaction(async (pushBatch) => {
      pushBatch(testDB.insert(objectives).values({ name: "test" }));
      pushBatch(testDB.insert(occupations).values({ name: "test" }));
    });
    const resultObj = await testDB.select().from(objectives);
    const resultOcc = await testDB.select().from(occupations);

    expect(resultObj).toHaveLength(objFixture().length + 1);
    expect(resultOcc).toHaveLength(occFixture().length + 1);

    expect(resultObj).toEqual(objFixture().concat([{ id: 11, name: "test" }]));
    expect(resultOcc).toEqual(occFixture().concat([{ id: 11, name: "test" }]));
  });

  test("エラーケース", async () => {
    const tx = new Transaction(DB);
    await expect(
      tx.transaction(async (pushBatch) => {
        pushBatch(testDB.insert(objectives).values({ name: "test" }));
        pushBatch(testDB.insert(occupations).values({ name: null }));
      }),
    ).rejects.toThrowError();

    const resultObj = await testDB.select().from(objectives);
    const resultOcc = await testDB.select().from(occupations);

    expect(resultObj).toHaveLength(objFixture().length);
    expect(resultOcc).toHaveLength(occFixture().length);

    expect(resultObj).toEqual(objFixture());
    expect(resultOcc).toEqual(occFixture());
  });
});
