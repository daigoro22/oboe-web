import type { ankiSessions } from "@/db/schema";
import { PROVIDER } from "@/lib/constant";
import { inject, injectable } from "tsyringe";

export type SessionAndPoint = {
  session: typeof ankiSessions.$inferSelect;
  point: number;
};
export interface IAnkiSession {
  getLatestSessionAndPoint: (userId: number) => Promise<SessionAndPoint>;
}

@injectable()
export default class AnkiSessionService {
  constructor(@inject("IAnkiSession") private ankiSession: IAnkiSession) {}

  async getLatestSessionAndPoint(userId: number) {
    return this.ankiSession.getLatestSessionAndPoint(userId);
  }
}
