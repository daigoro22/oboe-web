import type { users } from "@/db/schema";
import type { InferInsertModel } from "drizzle-orm";
import { inject, injectable } from "tsyringe";

export interface ISignUp {
	createUser: (user: InferInsertModel<typeof users>) => Promise<void>;
}

@injectable()
export default class SignUpService {
	constructor(@inject("ISignUp") private _signUp: ISignUp) {}

	async signUp(user: InferInsertModel<typeof users>) {
		await this._signUp.createUser(user);
	}
}
