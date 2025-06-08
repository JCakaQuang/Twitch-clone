CREATE TABLE `blockings` (
	`_id` text PRIMARY KEY NOT NULL,
	`blockerId` text NOT NULL,
	`blockedId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`blockerId`) REFERENCES `users`(`_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`blockedId`) REFERENCES `users`(`_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blockings_blockerId_blockedId_unique` ON `blockings` (`blockerId`,`blockedId`);--> statement-breakpoint
CREATE TABLE `follows` (
	`_id` text PRIMARY KEY NOT NULL,
	`followerId` text NOT NULL,
	`followingId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`followerId`) REFERENCES `users`(`_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`followingId`) REFERENCES `users`(`_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `follows_followerId_followingId_unique` ON `follows` (`followerId`,`followingId`);--> statement-breakpoint
CREATE TABLE `streams` (
	`_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`thumbnail` text,
	`ingressId` text,
	`serverUrl` text,
	`streamKey` text,
	`isLive` integer DEFAULT 0 NOT NULL,
	`isChatEnabled` integer DEFAULT 1 NOT NULL,
	`isChatDelayed` integer DEFAULT 0 NOT NULL,
	`isChatFollowersOnly` integer DEFAULT 0 NOT NULL,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `streams_ingressId_unique` ON `streams` (`ingressId`);--> statement-breakpoint
CREATE UNIQUE INDEX `streams_userId_unique` ON `streams` (`userId`);--> statement-breakpoint
CREATE TABLE `users` (
	`_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`imageUrl` text NOT NULL,
	`externalUserId` text NOT NULL,
	`bio` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_externalUserId_unique` ON `users` (`externalUserId`);