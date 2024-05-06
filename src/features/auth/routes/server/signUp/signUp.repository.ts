import { users } from "@/db/schema";
import type { ISignUp } from "./signUp.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import type { InferInsertModel } from "drizzle-orm";

export default class SignUpRepository implements ISignUp {
	private db: DrizzleD1Database;
	constructor(connection: D1Database) {
		this.db = drizzle(connection);
	}

	async createUser(user: InferInsertModel<typeof users>): Promise<void> {
		await this.db.insert(users).values(user);
	}
}
