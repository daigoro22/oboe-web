import { accounts, users } from "@/db/schema";
import type { IUser } from "./user.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

export default class UserRepository implements IUser {
  private db: DrizzleD1Database;
  constructor(connection: D1Database) {
    this.db = drizzle(connection);
  }

  async getUser(providerAccountId: string) {
    const res = await this.db
      .select({ users: users })
      .from(users)
      .innerJoin(accounts, eq(users.id, accounts.userId))
      .where(eq(accounts.providerAccountId, providerAccountId))
      .limit(1);

    return res[0]?.users;
  }

  async setPoint(userId: number, point: number) {
    await this.db.update(users).set({ point }).where(eq(users.id, userId));
  }
}
