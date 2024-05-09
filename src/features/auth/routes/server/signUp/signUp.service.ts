import type { accounts, users } from "@/db/schema";
import type { JWT } from "@auth/core/jwt";
import type { InferInsertModel } from "drizzle-orm";
import { inject, injectable } from "tsyringe";

export type User = InferInsertModel<typeof users>;
export type Provider = Omit<InferInsertModel<typeof accounts>, "id" | "userId">;
export interface ISignUp {
	signUp: (user: User, provider: Provider) => Promise<void>;
}

@injectable()
export default class SignUpService {
	constructor(@inject("ISignUp") private _signUp: ISignUp) {}

	async signUp(user: User, token?: JWT) {
		const [provider, providerAccountId] = [
			"https://access.line.me", // FIXME: JWT token から取得, 他のプロバイダにも対応
			token?.sub,
		];

		if (!providerAccountId) {
			throw new Error("provider account not found");
		}

		await this._signUp.signUp(user, { provider, providerAccountId });
	}
}
