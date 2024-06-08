import { accounts, users } from "@/db/schema";
import type { ISignUp, Provider, User } from "./signUp.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { desc } from "drizzle-orm";
export default class SignUpRepository implements ISignUp {
  private db: DrizzleD1Database;
  constructor(connection: D1Database) {
    this.db = drizzle(connection);
  }

  async signUp(user: User, provider: Provider): Promise<void> {
    const lastUserId = await this.db
      .select({ id: users.id })
      .from(users)
      .orderBy(desc(users.id))
      .limit(1);
    const targetUserId = (lastUserId[0]?.id ?? 0) + 1;

    //FIXME: トランザクション境界を service に持ってくる
    await this.db.batch([
      this.db.insert(users).values({ id: targetUserId, ...user }),
      this.db.insert(accounts).values({
        userId: targetUserId,
        ...provider,
      }),
    ]);
  }
}
