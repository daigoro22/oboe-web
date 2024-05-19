import type { ankiSessions } from "@/db/schema";
import { PROVIDER } from "@/lib/constant";
import { inject, injectable } from "tsyringe";

export type SessionAndPoint = {
  session: typeof ankiSessions.$inferSelect;
  point: number;
};
export interface IAnkiSession {
  getLatestSessionAndPoint: (
    accountId: string,
    provider: (typeof PROVIDER)[keyof typeof PROVIDER],
  ) => Promise<SessionAndPoint>;
}

@injectable()
export default class AnkiSessionService {
  constructor(@inject("IAnkiSession") private ankiSession: IAnkiSession) {}

  async getLatestSessionAndPoint(accountId?: string) {
    if (!accountId) {
      throw new Error("provider account not found");
    }
    return this.ankiSession.getLatestSessionAndPoint(accountId, PROVIDER.LINE); //FIXME: provider の判定ロジックを追加
  }
}
