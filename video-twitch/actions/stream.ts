"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { streams } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const updateStream = async (values: Partial<{
  thumbnail: string | null;
  title: string;
  isChatEnabled: number;
  isChatFollowersOnly: number;
  isChatDelayed: number;
}>) => {
  try {
    const self = await getSelf();

    // Lấy stream của user
    const selfStream = await db
      .select()
      .from(streams)
      .where(eq(streams.userId, self.id))
      .limit(1);

    if (selfStream.length === 0) {
      throw new Error("Stream not found");
    }

    const validData = {
      ...(values.thumbnail !== undefined && { thumbnail: values.thumbnail }),
      ...(values.title !== undefined && { title: values.title }),
      ...(values.isChatEnabled !== undefined && { isChatEnabled: values.isChatEnabled }),
      ...(values.isChatFollowersOnly !== undefined && { isChatFollowersOnly: values.isChatFollowersOnly }),
      ...(values.isChatDelayed !== undefined && { isChatDelayed: values.isChatDelayed }),
      updatedAt: new Date(),
    };

    await db
      .update(streams)
      .set(validData)
      .where(eq(streams.id, selfStream[0].id));

    // Revalidate path
    revalidatePath(`/u/${self.username}/chat`);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);

    return { success: true };
  } catch (err) {
    console.error("Error updating stream:", err);
    throw new Error("Internal Error");
  }
};
