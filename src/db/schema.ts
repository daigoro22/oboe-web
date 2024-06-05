import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  integer,
  real,
  sqliteTable,
  text,
  unique,
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
    point: integer("point").notNull().default(0),
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
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (accounts) => ({
    userFk: foreignKey({
      columns: [accounts.userId],
      foreignColumns: [users.id],
    }),
    providerUnique: unique().on(accounts.provider, accounts.providerAccountId),
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

export const ankiSessions = sqliteTable(
  "AnkiSessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deckPublicId: text("deckPublicId").notNull(),
    userId: integer("userId").notNull(),
    startsAt: integer("startsAt", { mode: "timestamp_ms" }),
    endsAt: integer("endsAt", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    isResumable: integer("isResumable").notNull().default(1),
    resumeCount: integer("resumeCount").notNull().default(0),
    publicId: text("publicId").notNull().unique(),
  },
  (ankiSessions) => ({
    deckFk: foreignKey({
      columns: [ankiSessions.deckPublicId],
      foreignColumns: [decks.publicId],
    }),
    userFk: foreignKey({
      columns: [ankiSessions.userId],
      foreignColumns: [users.id],
    }),
  }),
);

export const decks = sqliteTable(
  "Decks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    publicId: text("publicId").notNull().unique(),
  },
  (decks) => ({
    userFk: foreignKey({
      columns: [decks.userId],
      foreignColumns: [users.id],
    }),
  }),
);

export const cards = sqliteTable(
  "Cards",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deckId: integer("deckId").notNull(),
    number: integer("number").notNull(),
    frontContent: text("frontContent").notNull(),
    backContent: text("backContent").notNull(),
    stability: real("stability").notNull(),
    difficulty: real("difficulty").notNull(),
    due: integer("due", { mode: "timestamp_ms" }).notNull(),
    elapsedDays: integer("elapsedDays").notNull(),
    lastElapsedDays: integer("lastElapsedDays").notNull(),
    scheduledDays: integer("scheduledDays").notNull(),
    review: integer("review", { mode: "timestamp_ms" }).notNull(),
    duration: integer("duration").notNull(),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    pitch: real("pitch").notNull(),
    heading: real("heading").notNull(),
  },
  (cards) => ({
    deckFk: foreignKey({
      columns: [cards.deckId],
      foreignColumns: [decks.id],
    }),
  }),
);
