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
export class AnkiSessionFakeRepository
  extends AbstractFakerUtil
  implements IAnkiSession
{
  async getLatestSessionAndPoint(_: number) {
    return {
      point: 100,
      session: TEST_SESSION,
    };
  }
  createSession(_: number, __: string, ___: string) {
    return "test_query";
  }

  updatePoint(_: number, __: number) {
    return "test_query";
  }

  async getSessionById() {
    return TEST_SESSION;
  }

  updateResumable(_: number, __: string, ___: boolean) {
    return "test_query";
  }
  updateResumeCount(_: number, __: string, ___: number) {
    return "test_query";
  }
}
