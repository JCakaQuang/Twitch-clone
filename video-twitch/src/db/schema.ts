import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  followerId: text("followerId").notNull(),
  followingId: text("followingId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const blockings = sqliteTable("blockings", {
  id: text("_id").primaryKey(),
  blockerId: text("blockerId").notNull(),
  blockedId: text("blockedId").notNull(),
});

export const streams = sqliteTable("streams", {
  id: text("_id").primaryKey(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail"),
  ingressId: text("ingressId"),
  serverUrl: text("serverUrl"),
  streamKey: text("streamKey"),
  isLive: integer("isLive").notNull().default(0),
  isChatEnabled: integer("isChatEnabled").notNull().default(1),
  isChatDelayed: integer("isChatDelayed").notNull().default(0),
  isChatFollowersOnly: integer("isChatFollowersOnly").notNull().default(0),
  userId: text("userId").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});