import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: text().primaryKey(),
  username: text().notNull(),
  imageUrl: text().notNull(),
  externalUserId: text().notNull(),
  bio: text(),
});
