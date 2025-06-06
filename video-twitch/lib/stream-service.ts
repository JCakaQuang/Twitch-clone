import { db } from "@/src";
import { streams } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const getStreamByUserId = async (userId: string) => {
  const stream = await db
    .select()
    .from(streams)
    .where(eq(streams.userId, userId))
    .limit(1);

  return stream[0] ?? null;
};
