import type { ankiSessions, cards, decks } from "@/db/schema";
import { inject, injectable } from "tsyringe";
import type UserService from "@/features/auth/routes/server/user/user.service";
import type { BatchItem } from "drizzle-orm/batch";
import type { ITransaction } from "@/lib/transaction";
import { ANKI_SESSION_POINT, ANKI_SESSION_RESUME_LIMIT } from "@/lib/constant";
import { nanoid } from "nanoid";
import { Rating, type Grade, type StateType } from "ts-fsrs";
import { f } from "@/lib/fsrs";

export type SessionAndPoint = {
  session: typeof ankiSessions.$inferSelect;
  point: number;
};
type BatchQuery = BatchItem<"sqlite">;
export interface IAnkiSession {
  getLatestSession: (
    userId: number,
  ) => Promise<typeof ankiSessions.$inferSelect>;
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
  getSessionById: (
    userId: number,
    sessionPublicId: string,
  ) => Promise<typeof ankiSessions.$inferSelect>;
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
  getCardsByIds: (
    userId: number,
    deckPublicId: string,
    cardPublicIds: string[],
  ) => Promise<(typeof cards.$inferSelect)[]>;
  updateCards: (cardsData: CardsForUpdate) => BatchQuery[];
  updateIsResumableAndEndsAt: (
    userId: number,
    sessionId: number,
    isResumable: boolean,
    endsAt: Date,
  ) => BatchQuery;
}

export type CardsForUpdate = {
  publicId: (typeof cards.$inferInsert)["publicId"];
  due: (typeof cards.$inferInsert)["due"];
  stability: (typeof cards.$inferInsert)["stability"];
  difficulty: (typeof cards.$inferInsert)["difficulty"];
  elapsedDays: (typeof cards.$inferInsert)["elapsedDays"];
  scheduledDays: (typeof cards.$inferInsert)["scheduledDays"];
  reps: (typeof cards.$inferInsert)["reps"];
  lapses: (typeof cards.$inferInsert)["lapses"];
  lastReview: (typeof cards.$inferInsert)["lastReview"];
}[];

@injectable()
export default class AnkiSessionService {
  constructor(
    @inject("IAnkiSession") private ankiSession: IAnkiSession,
    @inject("Transaction") private tx: ITransaction,
  ) {}

  async getLatestSession(userId: number) {
    return this.ankiSession.getLatestSession(userId);
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
      const latest = await this.ankiSession.getLatestSession(user.id);

      pushBatch(
        this.ankiSession.createSession(user.id, deckPublicId, sessionPublicId),
      );
      pushBatch(this.ankiSession.updatePoint(user.id, updatedBalance));
      pushBatch(this.ankiSession.updateResumable(user.id, latest.id, false));
    });
    return sessionPublicId;
  }

  async resumeSession(userId: number, sessionPublicId: string) {
    const session = await this.ankiSession.getSessionById(
      userId,
      sessionPublicId,
    );

    if (!session) {
      throw new SessionNotFoundError("セッションが見つかりません");
    }

    await this.tx.transaction(async (pushBatch) => {
      //対象のセッションが完了済みならエラー
      if (session.endsAt) {
        throw new ResumeLimitExceededError("復帰回数が上限を超えました");
      }

      // 対象のセッションの復帰回数がn回以上もしくは復帰可能フラグが false ならエラー
      if (
        session.resumeCount >= ANKI_SESSION_RESUME_LIMIT ||
        !session.isResumable
      )
        throw new ResumeLimitExceededError("復帰回数が上限を超えました");

      //TODO: 復習可能な暗記カードを取得
      //TODO: 復習可能な暗記カードが一枚も無ければエラー

      //対象の ankiSession レコードの復帰回数++
      pushBatch(
        this.ankiSession.updateResumeCount(
          userId,
          session.id,
          session.resumeCount + 1,
        ),
      );

      //TODO: 復帰フラグの更新ロジック見直し
      // 復帰回数+1 >= nの場合, 復帰可能フラグを false に更新
      if (session.resumeCount + 1 >= ANKI_SESSION_RESUME_LIMIT) {
        pushBatch(this.ankiSession.updateResumable(userId, session.id, false));
      }
    });

    return session;
  }

  async endSession(
    userId: number,
    sessionPublicId: string,
    deckPublicId: string,
    cardsGrade: { cardPublicId: string; grade: Grade }[],
  ) {
    const session = await this.ankiSession.getSessionById(
      userId,
      sessionPublicId,
    );
    if (!session) {
      throw new SessionNotFoundError("セッションが見つかりません");
    }
    if (session.endsAt) {
      throw new SessionAlreadyEndedError("セッションはすでに終了しています");
    }

    const presentCards = await this.ankiSession.getCardsByIds(
      userId,
      deckPublicId,
      cardsGrade.map(({ cardPublicId }) => cardPublicId),
    );
    if (presentCards.length !== cardsGrade.length) {
      throw new CardNotFoundError("カードが見つかりません");
    }

    const repeats = presentCards.map(
      ({
        publicId,
        due,
        stability,
        difficulty,
        elapsedDays,
        scheduledDays,
        reps,
        lapses,
        state,
        lastReview,
      }) => ({
        publicId,
        repeat: f.repeat(
          {
            due,
            stability,
            difficulty,
            elapsed_days: elapsedDays,
            scheduled_days: scheduledDays,
            reps,
            lapses,
            state: state as StateType,
            last_review: lastReview,
          },
          new Date(),
        ),
      }),
    );

    const updatedCards = repeats.map(({ publicId, repeat }) => {
      const grade =
        cardsGrade.find(({ cardPublicId }) => cardPublicId === publicId)
          ?.grade ?? Rating.Again;
      return { publicId, ...repeat[grade].card };
    });

    const updateQueries = await this.ankiSession.updateCards(
      updatedCards.map(
        ({
          publicId,
          elapsed_days: elapsedDays,
          scheduled_days: scheduledDays,
          last_review: lastReview,
          ...rest
        }) => ({
          publicId,
          elapsedDays,
          scheduledDays,
          lastReview,
          ...rest,
        }),
      ),
    );

    this.tx.transaction(async (pushBatch) => {
      for (const query of updateQueries) {
        pushBatch(query);
      }
      pushBatch(
        this.ankiSession.updateIsResumableAndEndsAt(
          userId,
          session.id,
          false,
          new Date(),
        ),
      );
    });
  }
}

export class SessionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionNotFoundError";
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

export class SessionAlreadyEndedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionAlreadyEndedError";
  }
}

export class CardNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CardNotFoundError";
  }
}
