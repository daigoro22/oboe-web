import { faker } from "@/db/faker";
import type AnkiSessionRepository from "@/features/ankiSession/routes/server/ankiSession/ankiSession.repository";
import type { IAnkiSession } from "@/features/ankiSession/routes/server/ankiSession/ankiSession.service";
import { AbstractFakerUtil } from "@/lib/test-helper/faker";

export const TEST_SESSION = {
  id: 1,
  deckId: "1",
  deckPublicId: "test_deck",
  startsAt: null,
  endsAt: null,
  userId: 1,
  createdAt: new Date(),
  isResumable: 1,
  resumeCount: 0,
  publicId: "test_session",
};

export const TEST_SESSION_AND_DECK: Awaited<
  ReturnType<AnkiSessionRepository["getSessionAndDeckById"]>
> = {
  session: {
    id: faker.number.int(),
    startsAt: faker.date.past(),
    endsAt: null,
    isResumable: faker.number.int({ min: 0, max: 1 }),
    resumeCount: 0,
    publicId: faker.string.nanoid(),
    createdAt: faker.date.recent(),
  },
  deck: {
    id: faker.number.int(),
    publicId: faker.string.nanoid(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    createdAt: faker.date.recent(),
  },
  cards: Array.from({ length: 5 }, () => ({
    id: faker.number.int(),
    deckId: faker.number.int(),
    number: faker.number.int(),
    publicId: faker.string.nanoid(),
    frontContent: faker.lorem.sentence(),
    backContent: faker.lorem.sentence(),
    due: faker.date.past(),
    stability: faker.number.float({ min: 0.0, max: 1.0 }),
    difficulty: faker.number.float({ min: 0.0, max: 1.0 }),
    elapsedDays: faker.number.int({ min: 0, max: 365 }),
    scheduledDays: faker.number.int({ min: 1, max: 365 }),
    reps: faker.number.int(),
    lapses: faker.number.int(),
    state: faker.helpers.arrayElement(["new", "learning", "review"]),
    lastReview: faker.date.past(),
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
    pitch: faker.number.float({ min: -90, max: 90 }),
    heading: faker.number.float({ min: 0, max: 360 }),
  })),
};
export class AnkiSessionFakeRepository
  extends AbstractFakerUtil
  implements IAnkiSession
{
  async getLatestSession(_: number) {
    return TEST_SESSION;
  }

  createSession(_: number, __: string, ___: string) {
    return "test_query";
  }

  updatePoint(_: number, __: number) {
    return "test_query";
  }

  async getSessionAndDeckById() {
    return TEST_SESSION_AND_DECK;
  }

  async getSessionById(_: number, __: string) {
    return TEST_SESSION;
  }

  updateResumable(_: number, __: string, ___: boolean) {
    return "test_query";
  }
  updateResumeCount(_: number, __: string, ___: number) {
    return "test_query";
  }

  getCardsByIds(_: number, __: string, ___: string[]) {
    return TEST_SESSION_AND_DECK.cards;
  }

  updateCards(_: number, __: string, ___: string) {
    return "test_query";
  }

  updateIsResumableAndEndsAt(_: number, __: number, ___: boolean, ____: Date) {
    return "test_query";
  }
}
