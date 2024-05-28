import { createFixtures, DB, prepare, testDB } from "@/db/fixture";
import AnkiSessionRepository from "./ankiSession.repository";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ankiSessions, decks, users } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { PROVIDER } from "@/lib/constant";
import { TESTING_TIME, toIdGenerator } from "@/lib/test-helper";
import { eq } from "drizzle-orm";

let ankiSessionRepository: AnkiSessionRepository;
let ankiSessionFixtures: (typeof ankiSessions.$inferSelect)[];
let deckFixtures: (typeof decks.$inferSelect)[];
const { setupAll, users: usersFixture, accounts } = prepare();

beforeAll(async () => {
  await setupAll();
  ankiSessionRepository = new AnkiSessionRepository(DB);
  vi.setSystemTime(TESTING_TIME);
  deckFixtures = await createFixtures(
    decks,
    () => ({
      userId: String(toIdGenerator(usersFixture()).next().value),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      publicId: faker.string.nanoid(),
    }),
    10,
  );

  ankiSessionFixtures = await createFixtures(
    ankiSessions,
    () => ({
      userId: Number(toIdGenerator(usersFixture()).next().value),
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

describe("getLatestSessionAndPoint", () => {
  test("通常ケース", async () => {
    const res = await ankiSessionRepository.getLatestSessionAndPoint(
      usersFixture()[0].id,
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

describe("getSessionById", () => {
  test("通常ケース", async () => {
    const sessionId = ankiSessionFixtures[0].publicId;
    const res = await ankiSessionRepository.getSessionById(1, sessionId);

    expect(res).toEqual({
      createdAt: expect.any(Date),
      deckPublicId: "GIuM_z8oCkfHADr5IqiuJ",
      endsAt: null,
      id: 1,
      isResumable: 1,
      publicId: "7r2ipnl-wy7M_4bwtj6Af",
      resumeCount: 0,
      startsAt: null,
      userId: 1,
    });
  });
});

describe("createSessionAndUpdatePoint", () => {
  test("通常ケース", async () => {
    const userId = usersFixture()[0].id;
    const deckPublicId = deckFixtures[0].publicId;
    const point = 100;

    const sessionPublicId =
      await ankiSessionRepository.createSessionAndUpdatePoint(
        userId,
        deckPublicId,
        point,
      );

    expect(typeof sessionPublicId).toBe("string");
    expect(sessionPublicId.length).toBeGreaterThan(0);

    const createdSession = (
      await testDB
        .select()
        .from(ankiSessions)
        .where(eq(ankiSessions.publicId, sessionPublicId))
        .limit(1)
    )[0];
    expect(createdSession).toEqual({
      id: expect.any(Number),
      userId,
      deckPublicId,
      startsAt: expect.any(Date),
      endsAt: null,
      isResumable: 1,
      resumeCount: 0,
      publicId: sessionPublicId,
      createdAt: expect.any(Date),
    });

    const updatedUser = await testDB
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    expect(updatedUser[0]?.point).toBe(point);
  });
});
