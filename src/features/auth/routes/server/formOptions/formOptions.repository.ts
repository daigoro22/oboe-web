import { objectives, occupations } from "@/db/schema";
import type { IFormOptions } from "@/features/auth/routes/server/formOptions/formOptions.service";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";

export default class FormOptionsRepository implements IFormOptions {
	private db: DrizzleD1Database;
	constructor(connection: D1Database) {
		this.db = drizzle(connection);
	}

	async getObjectives() {
		return this.db.select().from(objectives).all();
	}

	async getOccupations() {
		return this.db.select().from(occupations).all();
	}
}
