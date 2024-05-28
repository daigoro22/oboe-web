import type { ankiSessions } from "@/db/schema";
import { container, inject, injectable } from "tsyringe";
import UserService from "@/features/auth/routes/server/user/user.service";

export type SessionAndPoint = {
  session: typeof ankiSessions.$inferSelect;
  point: number;
};
export interface IAnkiSession {
  getLatestSessionAndPoint: (userId: number) => Promise<SessionAndPoint>;
  createSessionAndUpdatePoint: (
    userId: number,
    deckPublicId: string,
    point: number,
  ) => Promise<string>;
  getSessionById: (
    publicId: string,
  ) => Promise<typeof ankiSessions.$inferSelect | undefined>;
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

  async getSessionById(publicId: string) {
    return this.ankiSession.getSessionById(publicId);
  }
}
