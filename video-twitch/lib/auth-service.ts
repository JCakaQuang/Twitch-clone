import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/src";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const getSelf = async () => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.externalUserId, self.id))
    .limit(1);

  if (user.length === 0) {
    throw new Error("Not found");
  }

  return user[0];
};


export const getSelfByUsername = async (username: string) => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (user.length === 0) {
    throw new Error("User not found");
  }

  if (self.username !== username) {
    throw new Error("Unauthorized");
  }

  return user[0];
};

