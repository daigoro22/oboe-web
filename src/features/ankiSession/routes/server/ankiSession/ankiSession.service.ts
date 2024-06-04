import type { ankiSessions, cards, decks } from "@/db/schema";
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
  getSessionAndDeckById: (
    userId: number,
    sessionPublicId: string,
  ) => Promise<
    | {
        session: Omit<
          typeof ankiSessions.$inferSelect,
          "createdAt" | "deckPublicId" | "userId"
        >;
        deck: Omit<typeof decks.$inferSelect, "userId">;
        cards: (typeof cards.$inferSelect)[];
      }
    | undefined
  >;
  updatePoint: (userId: number, point: number) => BatchQuery;
  updateResumable: (
    userId: number,
    sessionId: number,
    isResumable: boolean,
  ) => BatchQuery;
  updateResumeCount: (
    userId: number,
    sessionId: number,
    count: number,
  ) => BatchQuery;
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

  async getSessionAndDeckById(userId: number, publicId: string) {
    return this.ankiSession.getSessionAndDeckById(userId, publicId);
  }

  async startSession(
    user: NonNullable<Awaited<ReturnType<UserService["getUser"]>>>,
    deckPublicId: string,
  ) {
    const sessionPublicId = nanoid();
    await this.tx.transaction(async (pushBatch) => {
      const updatedBalance = user.point - ANKI_SESSION_POINT;
      if (updatedBalance < 0) {
        throw new InsufficientPointError("所持ポイントが足りません");
      }
      const { session: latest } =
        await this.ankiSession.getLatestSessionAndPoint(user.id);

      pushBatch(
        this.ankiSession.createSession(user.id, deckPublicId, sessionPublicId),
      );
      pushBatch(this.ankiSession.updatePoint(user.id, updatedBalance));
      pushBatch(this.ankiSession.updateResumable(user.id, latest.id, false));
    });
    return sessionPublicId;
  }

  async resumeSession(userId: number) {
    const { session: latest } =
      await this.ankiSession.getLatestSessionAndPoint(userId);

    await this.tx.transaction(async (pushBatch) => {
      //最新のセッションが完了済みならエラー
      if (latest.endsAt) {
        throw new ResumeLimitExceededError("復帰回数が上限を超えました");
      }

      // 最新のセッションの復帰回数がn回以上もしくは復帰可能フラグが false ならエラー
      if (
        latest.resumeCount >= ANKI_SESSION_RESUME_LIMIT ||
        !latest.isResumable
      )
        throw new ResumeLimitExceededError("復帰回数が上限を超えました");

      //最新の ankiSession レコードの復帰回数++
      pushBatch(
        this.ankiSession.updateResumeCount(
          userId,
          latest.id,
          latest.resumeCount + 1,
        ),
      );

      // 復帰回数+1 >= nの場合, 復帰可能フラグを false に更新
      if (latest.resumeCount + 1 >= ANKI_SESSION_RESUME_LIMIT) {
        pushBatch(this.ankiSession.updateResumable(userId, latest.id, false));
      }
    });

    return latest;
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
