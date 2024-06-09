import { ankiSessions, cards, decks, users } from "@/db/schema";
import type { CardsForUpdate, IAnkiSession } from "./ankiSession.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { desc, eq, and, sql, inArray } from "drizzle-orm";
import type { RunnableQuery } from "drizzle-orm/runnable-query";

export default class AnkiSessionRepository implements IAnkiSession {
  private db: DrizzleD1Database;
  constructor(connection: D1Database) {
    this.db = drizzle(connection);
  }

  async getLatestSession(
    userId: number,
  ): Promise<typeof ankiSessions.$inferSelect> {
    const latestSession =
      (
        await this.db
          .select()
          .from(ankiSessions)
          .where(eq(ankiSessions.userId, userId))
          .orderBy(desc(ankiSessions.createdAt))
          .limit(1)
      )[0] ?? undefined;
    return latestSession;
  }

  createSession(userId: number, deckPublicId: string, sessionPublicId: string) {
    return this.db.insert(ankiSessions).values({
      userId,
      deckPublicId,
      startsAt: new Date(),
      endsAt: null,
      isResumable: 1,
      resumeCount: 0,
      publicId: sessionPublicId,
    });
  }

  updatePoint(userId: number, point: number) {
    return this.db.update(users).set({ point }).where(eq(users.id, userId));
  }

  updateResumable(userId: number, sessionId: number, isResumable: boolean) {
    return this.db
      .update(ankiSessions)
      .set({ isResumable: isResumable ? 1 : 0 })
      .where(
        and(
          eq(ankiSessions.userId, userId),
          eq(ankiSessions.isResumable, 1),
          eq(ankiSessions.id, sessionId),
        ),
      );
  }

  updateResumeCount(userId: number, sessionId: number, count: number) {
    return this.db
      .update(ankiSessions)
      .set({ resumeCount: count })
      .where(
        and(eq(ankiSessions.userId, userId), eq(ankiSessions.id, sessionId)),
      );
  }

  async getSessionAndDeckById(userId: number, sessionPublicId: string) {
    const sessionAndDeckData = await this.db
      .select({
        session: {
          id: sql<number>`${ankiSessions.id}`.as("sessionId"),
          startsAt: ankiSessions.startsAt,
          endsAt: ankiSessions.endsAt,
          isResumable: ankiSessions.isResumable,
          resumeCount: ankiSessions.resumeCount,
          publicId: sql<string>`${ankiSessions.publicId}`.as("sessionPublicId"),
          createdAt: sql<Date>`${ankiSessions.createdAt}`.as(
            "sessionCreatedAt",
          ),
        },
        deck: {
          id: sql<number>`${decks.id}`.as("deckId"),
          publicId: decks.publicId,
          name: decks.name,
          description: decks.description,
          createdAt: sql<Date>`${decks.createdAt}`.as("deckCreatedAt"),
        },
      })
      .from(ankiSessions)
      .innerJoin(decks, eq(ankiSessions.deckPublicId, decks.publicId))
      .where(
        and(
          eq(ankiSessions.publicId, sessionPublicId),
          eq(ankiSessions.userId, userId),
        ),
      );

    if (sessionAndDeckData.length < 1) {
      return undefined;
    }

    const cardsData = await this.db
      .select()
      .from(cards)
      .where(eq(cards.deckId, sessionAndDeckData[0].deck.id));

    return {
      session: sessionAndDeckData[0].session,
      deck: sessionAndDeckData[0].deck,
      cards: cardsData,
    };
  }

  async getSessionById(userId: number, sessionPublicId: string) {
    const data = (
      await this.db
        .select()
        .from(ankiSessions)
        .where(
          and(
            eq(ankiSessions.publicId, sessionPublicId),
            eq(ankiSessions.userId, userId),
          ),
        )
    )[0];

    return data;
  }

  async getCardsByIds(
    userId: number,
    deckPublicId: string,
    cardPublicIds: string[],
  ) {
    const cardsData = await this.db
      .select({
        id: cards.id,
        deckId: cards.deckId,
        number: cards.number,
        publicId: cards.publicId,
        frontContent: cards.frontContent,
        backContent: cards.backContent,
        due: cards.due,
        stability: cards.stability,
        difficulty: cards.difficulty,
        elapsedDays: cards.elapsedDays,
        scheduledDays: cards.scheduledDays,
        reps: cards.reps,
        lapses: cards.lapses,
        state: cards.state,
        lastReview: cards.lastReview,
        lat: cards.lat,
        lng: cards.lng,
        pitch: cards.pitch,
        heading: cards.heading,
      })
      .from(cards)
      .where(and(inArray(cards.publicId, cardPublicIds), eq(users.id, userId)))
      .innerJoin(decks, eq(decks.publicId, deckPublicId))
      .innerJoin(users, eq(users.id, decks.userId));

    return cardsData;
  }

  updateCards(cardsData: CardsForUpdate) {
    const cardPublicIds = cardsData.map((card) => card.publicId);
    const cardsDataWithoutID = cardsData.map(
      ({ publicId: _, ...rest }) => rest,
    );
    const res = cardPublicIds.map((pid, i) =>
      this.db
        .update(cards)
        .set(cardsDataWithoutID[i])
        .where(and(eq(cards.publicId, pid))),
    );
    return res;
  }

  updateIsResumableAndEndsAt(
    userId: number,
    sessionId: number,
    isResumable: boolean,
    endsAt: Date,
  ) {
    return this.db
      .update(ankiSessions)
      .set({ isResumable: isResumable ? 1 : 0, endsAt })
      .where(
        and(eq(ankiSessions.userId, userId), eq(ankiSessions.id, sessionId)),
      );
  }
}
