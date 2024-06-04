import { ankiSessions, cards, decks, users } from "@/db/schema";
import type { IAnkiSession, SessionAndPoint } from "./ankiSession.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { desc, eq, and, sql } from "drizzle-orm";

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
}
