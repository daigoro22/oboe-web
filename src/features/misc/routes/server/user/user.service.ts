import type { users } from "@/db/schema";
import { inject, injectable } from "tsyringe";

export interface IUser {
  getUser: (providerAccountId: string) => Promise<typeof users.$inferSelect>;
  setPoint: (userId: number, point: number) => Promise<void>;
}

@injectable()
export default class UserService {
  constructor(@inject("IUser") private user: IUser) {}

  async getUser(providerAccountId?: string) {
    if (!providerAccountId) {
      return undefined;
    }
    const res = await this.user.getUser(providerAccountId);
    return res ? { id: res.id, point: res.point } : undefined;
  }
}
