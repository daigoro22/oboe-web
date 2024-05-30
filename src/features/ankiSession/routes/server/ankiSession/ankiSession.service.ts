import type { ankiSessions } from "@/db/schema";
import { container, inject, injectable } from "tsyringe";
import UserService from "@/features/auth/routes/server/user/user.service";
import type { BatchItem } from "drizzle-orm/batch";

export type SessionAndPoint = {
  session: typeof ankiSessions.$inferSelect;
  point: number;
};
type BatchQuery = BatchItem<"sqlite">;
export interface IAnkiSession {
  getLatestSessionAndPoint: (userId: number) => Promise<SessionAndPoint>;
  createSession: (
    userId: number,
    deckPublicId: string,
    sessionPublicId: string,
  ) => BatchQuery;
  getSessionById: (
    userId: number,
    publicId: string,
  ) => Promise<typeof ankiSessions.$inferSelect | undefined>;
  updatePoint: (userId: number, point: number) => BatchQuery;
}
@injectable()
export default class AnkiSessionService {
  constructor(
    @inject("IAnkiSession") private ankiSession: IAnkiSession,
    private userService: UserService,
  ) {
    this.userService = container.resolve(UserService);
  }

  async getLatestSessionAndPoint(userId: number) {
    return this.ankiSession.getLatestSessionAndPoint(userId);
  }

  async getSessionById(userId: number, publicId: string) {
    return this.ankiSession.getSessionById(userId, publicId);
  }
}
