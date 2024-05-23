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
      }),
      10,
    );

    await createFixtures(
      ankiSessions,
      () => ({
        userId: String(toIdGenerator(users()).next().value),
        deckId: String(toIdGenerator(deckFixtures).next().value),
        startsAt: null,
        endsAt: null,
        createdAt: new Date(),
      }),
      10,
    );
  });

  test("通常ケース", async () => {
    const res = await ankiSessionRepository.getLatestSessionAndPoint(
      String(users()[0].id),
    );

    expect(res).toEqual({
      point: 6833,
      session: {
        createdAt: TESTING_TIME,
        deckId: "1",
        endsAt: null,
        id: 1,
        startsAt: null,
        userId: "1",
      },
    });
  });

  test("アカウントが見つからないケース", async () => {
    const res = await ankiSessionRepository.getLatestSessionAndPoint(
      "nonexistent_user_id",
    );

    expect(res).toEqual({ point: undefined, session: undefined });
  });
});
