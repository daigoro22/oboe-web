import { createFixtures, DB, prepare, testDB } from "@/db/fixture";
import AnkiSessionRepository from "./ankiSession.repository";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { ankiSessions, cards, decks, users } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { TESTING_TIME, toIdGenerator } from "@/lib/test-helper";
import { eq } from "drizzle-orm";

let ankiSessionRepository: AnkiSessionRepository;
let ankiSessionFixtures: (typeof ankiSessions.$inferSelect)[];
let deckFixtures: (typeof decks.$inferSelect)[];
let cardFixtures: (typeof cards.$inferSelect)[];
const { setupAll, users: usersFixture, accounts } = prepare();

beforeAll(async () => {
  await setupAll();
  ankiSessionRepository = new AnkiSessionRepository(DB);
  vi.setSystemTime(TESTING_TIME);
  const deckUserId = toIdGenerator(usersFixture());
  deckFixtures = await createFixtures(
    decks,
    () => ({
      userId: Number(deckUserId.next().value),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      publicId: faker.string.nanoid(),
    }),
    10,
  );

  const sessionUserId = toIdGenerator(usersFixture());
  const sessionDeckId = toIdGenerator(deckFixtures, "publicId");
  ankiSessionFixtures = await createFixtures(
    ankiSessions,
    () => ({
      userId: Number(sessionUserId.next().value),
      deckPublicId: String(sessionDeckId.next().value),
      startsAt: null,
      endsAt: null,
      publicId: faker.string.nanoid(),
    }),
    10,
  );

  const cardDeckId = toIdGenerator(deckFixtures);
  cardFixtures = await createFixtures(
    cards,
    () => ({
      deckId: Number(cardDeckId.next().value),
      number: faker.number.int({ min: 1, max: 100 }),
      frontContent: faker.lorem.sentence(),
      backContent: faker.lorem.sentence(),
      stability: faker.number.float({ min: 0.0, max: 1.0 }),
      difficulty: faker.number.float({ min: 0.0, max: 1.0 }),
      due: faker.date.future(),
      elapsedDays: faker.number.int({ min: 0, max: 365 }),
      lastElapsedDays: faker.number.int({ min: 0, max: 365 }),
      scheduledDays: faker.number.int({ min: 1, max: 365 }),
      review: faker.date.future(),
      duration: faker.number.int({ min: 1, max: 3600 }), // 1秒から1時間
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
      pitch: faker.number.float({ min: -90, max: 90 }),
      heading: faker.number.float({ min: 0, max: 360 }),
    }),
    5,
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
        createdAt: expect.any(Date),
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

describe("getSessionAndDeckById", () => {
  test("通常ケース", async () => {
    const userId = usersFixture()[0].id;
    const sessionId = ankiSessionFixtures[0].publicId;
    const res = await ankiSessionRepository.getSessionAndDeckById(
      userId,
      sessionId,
    );

    const {
      createdAt: _,
      deckPublicId: __,
      userId: ___,
      ...sessionTobe
    } = ankiSessionFixtures[0];

    const { userId: ____, ...deckTobe } = deckFixtures[0];

    expect(res).toEqual({
      cards: [cardFixtures[0]],
      deck: { ...deckTobe, createdAt: expect.any(String) },
      session: { ...sessionTobe, createdAt: expect.any(String) },
    });
  });
});

describe("createSession", () => {
  test("通常ケース", async () => {
    const userId = usersFixture()[0].id;
    const deckPublicId = deckFixtures[0].publicId;
    const sessionPublicId = faker.string.nanoid();

    await ankiSessionRepository.createSession(
      userId,
      deckPublicId,
      sessionPublicId,
    );

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
  });
});

describe("updatePoint", () => {
  test("通常ケース", async () => {
    const userId = usersFixture()[0].id;
    const point = 100;
    await ankiSessionRepository.updatePoint(userId, point);
    const updatedUser = await testDB
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    expect(updatedUser[0]?.point).toBe(point);
  });
});

describe("updateResumable", () => {
  test("通常ケース", async () => {
    const userId = usersFixture()[0].id;
    const sessionId = ankiSessionFixtures[0].id;
    await expect(
      ankiSessionRepository.updateResumable(userId, sessionId, false),
    ).resolves.not.toThrowError();

    const updatedSession = await testDB
      .select()
      .from(ankiSessions)
      .where(eq(ankiSessions.id, sessionId))
      .limit(1);

    expect(updatedSession[0]?.userId).toBe(userId);
    expect(updatedSession[0]?.isResumable).toBe(0);
  });
});

describe("updateResumeCount", () => {
  test("通常ケース", async () => {
    const userId = usersFixture()[0].id;
    const sessionId = ankiSessionFixtures[0].id;
    const count = 10;

    expect(ankiSessionFixtures[0]?.resumeCount).toBe(0);
    await expect(
      ankiSessionRepository.updateResumeCount(userId, sessionId, count),
    ).resolves.not.toThrowError();
    const updatedSession = await testDB
      .select()
      .from(ankiSessions)
      .where(eq(ankiSessions.id, sessionId))
      .limit(1);
    expect(updatedSession[0]?.resumeCount).toBe(count);
  });
});
