import type { accounts, users } from "@/db/schema";
import { PROVIDER } from "@/lib/constant";
import type { JWT } from "@auth/core/jwt";
import type { AuthUser } from "@hono/auth-js";
import type { InferInsertModel } from "drizzle-orm";
import { inject, injectable } from "tsyringe";

export type User = InferInsertModel<typeof users>;
export type Provider = Omit<InferInsertModel<typeof accounts>, "id" | "userId">;
export interface ISignUp {
  signUp: (user: User, provider: Provider) => Promise<void>;
  getAccountAndUser: (providerAccountId: string) => Promise<{
    accountId: string | undefined;
    userId: string | undefined;
  }>;
}

@injectable()
export default class SignUpService {
  constructor(@inject("ISignUp") private _signUp: ISignUp) {}

  async signUp(user: User, token?: JWT) {
    const [provider, providerAccountId] = [
      PROVIDER.LINE, // FIXME: JWT token から取得, 他のプロバイダにも対応
      token?.sub,
    ];

    if (!providerAccountId) {
      throw new Error("provider account not found");
    }

    await this._signUp.signUp(user, { provider, providerAccountId });
  }

  async isSignedUp(user: AuthUser) {
    if (!user || !user.token?.sub) {
      return false;
    }
    const res = await this._signUp.getAccountAndUser(user.token.sub);
    return !!(res?.accountId && res?.userId);
  }
}
