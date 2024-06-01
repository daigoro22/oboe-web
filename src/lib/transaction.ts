import type { BatchItem, BatchResponse } from "drizzle-orm/batch";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";

export interface ITransaction {
  transaction: <U extends BatchItem<"sqlite">>(
    tran: (batch: (query: U) => void) => Promise<unknown>,
  ) => Promise<unknown>;
}

export class Transaction implements ITransaction {
  private db: DrizzleD1Database;
  constructor(connection: D1Database) {
    this.db = drizzle(connection);
  }

  async transaction<U extends BatchItem<"sqlite">>(
    tran: (batch: (query: U) => void) => Promise<unknown>,
  ): Promise<unknown> {
    const batch: U[] = [];
    const res = await tran((query) => batch.push(query));
    if (!batch[0]) {
      throw new BatchEmptyError("batch is empty");
    }
    const b = [batch[0], ...batch.slice(1)] as const;
    await this.db.batch(b);
    return res;
  }
}

class BatchEmptyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BatchEmptyError";
  }
}
