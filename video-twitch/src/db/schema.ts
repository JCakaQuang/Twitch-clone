import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("_id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  imageUrl: text("imageUrl").notNull(),
  externalUserId: text("externalUserId").notNull().unique(),
  bio: text("bio"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const follows = sqliteTable("follows", {
  id: text("_id").primaryKey(),
  followerId: text("followerId").notNull().references(() => users.id),
  followingId: text("followingId").notNull().references(() => users.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
}, (table) => ({
  uniqueFollow: unique().on(table.followerId, table.followingId),
}));

export const blockings = sqliteTable("blockings", {
  id: text("_id").primaryKey(),
  blockerId: text("blockerId").notNull().references(() => users.id),
  blockedId: text("blockedId").notNull().references(() => users.id),
}, (table) => ({
  uniqueBlock: unique().on(table.blockerId, table.blockedId),
}));

export const streams = sqliteTable("streams", {
  id: text("_id").primaryKey(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail"),
  ingressId: text("ingressId").unique(),
  serverUrl: text("serverUrl"),
  streamKey: text("streamKey"),
  isLive: integer("isLive").notNull().default(0),
  isChatEnabled: integer("isChatEnabled").notNull().default(1),
  isChatDelayed: integer("isChatDelayed").notNull().default(0),
  isChatFollowersOnly: integer("isChatFollowersOnly").notNull().default(0),
  userId: text("userId").notNull().unique().references(() => users.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});
