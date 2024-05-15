ALTER TABLE AnkiSessions ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE Decks ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL;