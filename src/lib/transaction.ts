import type { BatchItem, BatchResponse } from "drizzle-orm/batch";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";

export interface ITransaction {
  transaction: <U extends BatchItem<"sqlite">>(
    tran: (batch: (query: U) => void) => Promise<unknown>,
  ) => Promise<BatchResponse<Readonly<[U, ...U[]]>>>;
}

export class Transaction implements ITransaction {
  private db: DrizzleD1Database;
  constructor(connection: D1Database) {
    this.db = drizzle(connection);
  }

  async transaction<U extends BatchItem<"sqlite">>(
    tran: (batch: (query: U) => void) => Promise<unknown>,
  ): Promise<BatchResponse<Readonly<[U, ...U[]]>>> {
    const batch: U[] = [];
    await tran((query) => batch.push(query));
    if (!batch[0]) {
      throw new BatchEmptyError("batch is empty");
    }
    const b = [batch[0], ...batch.slice(1)] as const;
    return this.db.batch(b);
  }
}

class BatchEmptyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BatchEmptyError";
  }
}
