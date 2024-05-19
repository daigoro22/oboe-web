CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `AnkiSessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deckId` text NOT NULL,
	`userId` text NOT NULL,
	`startsAt` integer,
	`endsAt` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `objectives` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `occupations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`birth_date` integer NOT NULL,
	`gender` text NOT NULL,
	`occupation_id` integer NOT NULL,
	`objective_id` integer NOT NULL,
	`customer_id` text NOT NULL,
	`point` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`occupation_id`) REFERENCES `occupations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`objective_id`) REFERENCES `objectives`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_provider_provider_account_id_unique` ON `accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_customer_id_unique` ON `users` (`customer_id`);