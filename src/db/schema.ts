import { relations, sql } from "drizzle-orm";
import {
	foreignKey,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
	"users",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		image: text("image"),
		birthDate: integer("birth_date", { mode: "timestamp" }).notNull(),
		gender: text("gender", {
			enum: ["男", "女", "その他", "無回答"],
		}).notNull(),
		occupationId: integer("occupation_id").notNull(),
		objectiveId: integer("objective_id").notNull(),
		customerId: text("customer_id").notNull().unique(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(users) => ({
		occupationFk: foreignKey({
			columns: [users.occupationId],
			foreignColumns: [occupations.id],
		}),
		objectiveFk: foreignKey({
			columns: [users.objectiveId],
			foreignColumns: [objectives.id],
		}),
	}),
);

export const accounts = sqliteTable(
	"accounts",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: integer("user_id").notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
	},
	(accounts) => ({
		userFk: foreignKey({
			columns: [accounts.userId],
			foreignColumns: [users.id],
		}),
	}),
);

export const usersRelations = relations(users, ({ many }) => ({
	users: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const occupations = sqliteTable("occupations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
});

export const objectives = sqliteTable("objectives", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
});
