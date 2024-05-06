import { users } from "@/db/schema";
import type { ISignUp } from "./signUp.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";

export default class SignUpRepository implements ISignUp {
	private db: DrizzleD1Database;
	constructor(connection: D1Database) {
		this.db = drizzle(connection);
	}

	async createUser(user) {
		this.db.insert(users).values(user);
	}
}
