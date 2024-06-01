import { ankiSessions, users } from "@/db/schema";
import type { IAnkiSession, SessionAndPoint } from "./ankiSession.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { desc, eq, and } from "drizzle-orm";
import type { RunnableQuery } from "drizzle-orm/runnable-query";

export default class AnkiSessionRepository implements IAnkiSession {
  private db: DrizzleD1Database;
  constructor(connection: D1Database) {
    this.db = drizzle(connection);
  }

  async getLatestSessionAndPoint(userId: number): Promise<SessionAndPoint> {
    const latestSessionAndPoint = (
      await this.db
        .select({
          session: ankiSessions,
          point: users.point,
        })
        .from(users)
        .innerJoin(ankiSessions, eq(ankiSessions.userId, users.id))
        .where(eq(users.id, userId))
        .orderBy(desc(ankiSessions.createdAt))
        .limit(1)
    )[0] ?? { point: undefined, session: undefined };
    return latestSessionAndPoint;
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

  async getSessionById(userId: number, publicId: string) {
    const data = (
      await this.db
        .select()
        .from(ankiSessions)
        .where(
          and(
            eq(ankiSessions.publicId, publicId),
            eq(ankiSessions.userId, userId),
          ),
        )
        .limit(1)
    )[0];

    return data ?? undefined;
  }
}
