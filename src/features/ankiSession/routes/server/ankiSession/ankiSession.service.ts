import type { ankiSessions } from "@/db/schema";
import { inject, injectable } from "tsyringe";
import type UserService from "@/features/auth/routes/server/user/user.service";
import type { BatchItem } from "drizzle-orm/batch";
import type { ITransaction } from "@/lib/transaction";
import { ANKI_SESSION_POINT, ANKI_SESSION_RESUME_LIMIT } from "@/lib/constant";
import { nanoid } from "nanoid";

export type SessionAndPoint = {
  session: typeof ankiSessions.$inferSelect;
  point: number;
};
type BatchQuery = BatchItem<"sqlite">;
export interface IAnkiSession {
  getLatestSessionAndPoint: (userId: number) => Promise<SessionAndPoint>;
  createSession: (
    userId: number,
    deckPublicId: string,
    sessionPublicId: string,
  ) => BatchQuery;
  getSessionById: (
    userId: number,
    publicId: string,
  ) => Promise<typeof ankiSessions.$inferSelect | undefined>;
  updatePoint: (userId: number, point: number) => BatchQuery;
}
@injectable()
export default class AnkiSessionService {
  constructor(
    @inject("IAnkiSession") private ankiSession: IAnkiSession,
    @inject("Transaction") private tx: ITransaction,
  ) {}

  async getLatestSessionAndPoint(userId: number) {
    return this.ankiSession.getLatestSessionAndPoint(userId);
  }

  async getSessionById(userId: number, publicId: string) {
    return this.ankiSession.getSessionById(userId, publicId);
  }

  async startSession(
    user: NonNullable<Awaited<ReturnType<UserService["getUser"]>>>,
    deckPublicId: string,
  ) {
    await this.tx.transaction(async (pushBatch) => {
      const updatedBalance = user.point - ANKI_SESSION_POINT;
      if (updatedBalance < 0) {
        throw new InsufficientPointError("所持ポイントが足りません");
      }

      const sessionPublicId = nanoid();
      pushBatch(
        this.ankiSession.createSession(user.id, deckPublicId, sessionPublicId),
      );
      pushBatch(this.ankiSession.updatePoint(user.id, updatedBalance));
      //FIXME: バッチに復帰フラグの更新を追加
    });
  }
}

export class InsufficientPointError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InsufficientPointError";
  }
}

export class ResumeLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumeLimitExceededError";
  }
}
