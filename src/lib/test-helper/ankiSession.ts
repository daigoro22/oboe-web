import type { IAnkiSession } from "@/features/ankiSession/routes/server/ankiSession/ankiSession.service";
import { AbstractFakerUtil } from "@/lib/test-helper/faker";

export class AnkiSessionFakeRepository
  extends AbstractFakerUtil
  implements IAnkiSession
{
  async getLatestSessionAndPoint(_: number) {
    return {
      point: 100,
      session: {
        id: 1,
        deckId: "1",
        startsAt: null,
        endsAt: null,
        userId: "1",
        createdAt: new Date(),
        isResumable: 1,
        resumeCount: 0,
      },
    };
  }
}
