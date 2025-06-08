import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { eq, desc, and, not, exists } from "drizzle-orm";
import { streams, users, blockings } from "@/src/db/schema";

export const getStreams = async () => {
  const rows = await db
    .select({
      id: streams.id,
      userId: users.id,
      username: users.username,
      imageUrl: users.imageUrl,
      isLive: streams.isLive,
      title: streams.title,
      thumbnail: streams.thumbnail,
    })
    .from(streams)
    .innerJoin(users, eq(users.id, streams.userId))
    .where(eq(streams.isLive, 1)) // hoặc để không filter live thì bỏ dòng này
    .orderBy(streams.createdAt);

  return rows.map(row => ({
    id: row.id,
    user: {
      id: row.userId,
      username: row.username,
      imageUrl: row.imageUrl,
    },
    isLive: row.isLive === 1,
    title: row.title,
    thumbnail: row.thumbnail,
  }));
};