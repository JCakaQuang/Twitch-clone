import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users_table", {
  id: text().primaryKey(),
  username: text().notNull(),
  imageUrl: text().notNull(),
  externalUserId: text().notNull(),
  bio: text(),
});

export const follows = sqliteTable("follow", {
  id: text("id").primaryKey(),
  followerId: text("followerId").notNull(),
  followingId: text("followingId").notNull(),
});

export const blockings = sqliteTable("blocking", {
  id: text("id").primaryKey(),
  blockerId: text("blockerId").notNull(),
  blockedId: text("blockedId").notNull(),
});

export const streams = sqliteTable('stream', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(), // FK to user.id
  isLive: text('isLive'),
  isChatDelayed: text('isChatDelayed'),
  isChatEnabled: text('isChatEnabled'),
  isChatFollowersOnly: text('isChatFollowersOnly'),
  thumbnailUrl: text('thumbnailUrl'),
  name: text('name'),
});