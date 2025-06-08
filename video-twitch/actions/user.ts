"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/src";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { getSelf } from "@/lib/auth-service";

export const updateUser = async (values: { bio?: string }) => {
  const self = await getSelf();

  const validData = {
    bio: values.bio,
  };

  // Update user bằng Drizzle ORM
  await db
    .update(users)
    .set(validData)
    .where(eq(users.id, self.id));

  // Sau khi update, query lại user mới
  const updatedUser = await db
    .select()
    .from(users)
    .where(eq(users.id, self.id))
    .then(rows => rows[0]);

  revalidatePath(`/${self.username}`);
  revalidatePath(`/u/${self.username}`);

  return updatedUser;
};
