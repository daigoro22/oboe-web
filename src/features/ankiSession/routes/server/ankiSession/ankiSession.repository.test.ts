import { createFixtures, DB, prepare } from "@/db/fixture";
import AnkiSessionRepository from "./ankiSession.repository";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ankiSessions, decks } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { PROVIDER } from "@/lib/constant";
import { TESTING_TIME, toIdGenerator } from "@/lib/test-helper";

describe("ankiSession.repository", () => {
  let ankiSessionRepository: AnkiSessionRepository;
  const { setupAll, users, accounts } = prepare();

  beforeAll(async () => {
    await setupAll();
    ankiSessionRepository = new AnkiSessionRepository(DB);
    vi.setSystemTime(TESTING_TIME);
    const deckFixtures = await createFixtures(
      decks,
      () => ({
        userId: String(toIdGenerator(users()).next().value),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        publicId: faker.string.nanoid(),
      }),
      10,
    );

    await createFixtures(
      ankiSessions,
      () => ({
        userId: Number(toIdGenerator(users()).next().value),
        deckPublicId: String(
          toIdGenerator(deckFixtures, "publicId").next().value,
        ),
        startsAt: null,
        endsAt: null,
        createdAt: new Date(),
        publicId: faker.string.nanoid(),
      }),
      10,
    );
  });

  test("通常ケース", async () => {
    const res = await ankiSessionRepository.getLatestSessionAndPoint(
      users()[0].id,
    );

    expect(res).toEqual({
      point: 6833,
      session: {
        createdAt: TESTING_TIME,
        deckPublicId: "GIuM_z8oCkfHADr5IqiuJ",
        endsAt: null,
        id: 1,
        startsAt: null,
        userId: 1,
        isResumable: 1,
        resumeCount: 0,
        publicId: "7r2ipnl-wy7M_4bwtj6Af",
      },
    });
  });

  test("アカウントが見つからないケース", async () => {
    const res = await ankiSessionRepository.getLatestSessionAndPoint(-1);

    expect(res).toEqual({ point: undefined, session: undefined });
  });
});
