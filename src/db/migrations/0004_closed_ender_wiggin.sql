CREATE TABLE `AnkiSessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deckId` text NOT NULL,
	`userId` text NOT NULL,
	`startsAt` integer NOT NULL,
	`endsAt` integer NOT NULL,
	`deckName` text NOT NULL,
	FOREIGN KEY (`deckId`) REFERENCES `Decks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deckId` text NOT NULL,
	`number` integer NOT NULL,
	`frontContent` text NOT NULL,
	`backContent` text NOT NULL,
	`stability` real NOT NULL,
	`difficulty` real NOT NULL,
	`due` integer NOT NULL,
	`elapsedDays` integer NOT NULL,
	`lastElapsedDays` integer NOT NULL,
	`scheduledDays` integer NOT NULL,
	`review` integer NOT NULL,
	`duration` integer NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`pitch` real NOT NULL,
	`heading` real NOT NULL,
	FOREIGN KEY (`deckId`) REFERENCES `Decks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Decks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
