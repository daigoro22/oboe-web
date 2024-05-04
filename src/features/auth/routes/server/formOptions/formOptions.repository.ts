import { objectives, occupations } from "@/db/schema";
import { drizzle } from "drizzle-orm/d1";

export const getOccupations = async (connection: D1Database) => {
	const db = drizzle(connection);
	return await db.select().from(occupations).all();
};

export const getObjectives = async (connection: D1Database) => {
	const db = drizzle(connection);
	return await db.select().from(objectives).all();
};
