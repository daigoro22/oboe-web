import type { accounts, users } from "@/db/schema";
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

	async signUp(user: User, provider: Provider) {
		await this._signUp.signUp(user, provider);
	}
}
