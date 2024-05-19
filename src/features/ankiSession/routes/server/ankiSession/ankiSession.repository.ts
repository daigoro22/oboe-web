import { accounts, ankiSessions, users } from "@/db/schema";
import type { IAnkiSession, SessionAndPoint } from "./ankiSession.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { desc, eq, and } from "drizzle-orm";

export default class AnkiSessionRepository implements IAnkiSession {
  private db: DrizzleD1Database;
  constructor(connection: D1Database) {
    this.db = drizzle(connection);
  }

  async getLatestSessionAndPoint(
    accountId: string,
    provider: string,
  ): Promise<SessionAndPoint> {
    const latestSessionAndPoint = (
      await this.db
        .select({
          session: ankiSessions,
          point: users.point,
        })
        .from(users)
        .innerJoin(accounts, eq(users.id, accounts.userId))
        .innerJoin(ankiSessions, eq(users.id, ankiSessions.userId))
        .where(
          and(
            eq(accounts.providerAccountId, accountId),
            eq(accounts.provider, provider),
          ),
        )
        .orderBy(desc(ankiSessions.createdAt))
        .limit(1)
    )[0] ?? { point: undefined, session: undefined };
    return latestSessionAndPoint;
  }
}
