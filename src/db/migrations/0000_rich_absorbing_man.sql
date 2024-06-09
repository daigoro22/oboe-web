CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `anki_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deck_public_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`starts_at` integer,
	`ends_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`is_resumable` integer DEFAULT 1 NOT NULL,
	`resume_count` integer DEFAULT 0 NOT NULL,
	`public_id` text NOT NULL,
	FOREIGN KEY (`deck_public_id`) REFERENCES `decks`(`public_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`deck_id` integer NOT NULL,
	`number` integer NOT NULL,
	`public_id` text NOT NULL,
	`front_content` text NOT NULL,
	`back_content` text NOT NULL,
	`due` integer NOT NULL,
	`stability` real NOT NULL,
	`difficulty` real NOT NULL,
	`elapsed_days` integer NOT NULL,
	`scheduled_days` integer NOT NULL,
	`reps` integer NOT NULL,
	`lapses` integer NOT NULL,
	`state` text DEFAULT 'New' NOT NULL,
	`last_review` integer,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`pitch` real NOT NULL,
	`heading` real NOT NULL,
	FOREIGN KEY (`deck_id`) REFERENCES `decks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `decks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`public_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE UNIQUE INDEX `anki_sessions_public_id_unique` ON `anki_sessions` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `cards_public_id_unique` ON `cards` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `decks_public_id_unique` ON `decks` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_customer_id_unique` ON `users` (`customer_id`);