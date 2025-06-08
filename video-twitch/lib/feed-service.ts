import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { eq, desc, and, not, exists } from "drizzle-orm";
import { streams, users, blockings } from "@/src/db/schema";

export const getStreams = async () => {
  let userId: string | null = null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let result = [];

  if (userId) {
    result = await db
      .select({
        id: streams.id,
        isLive: streams.isLive,
        title: streams.title,
        thumbnail: streams.thumbnail,
        user: {
          id: users.id,
          email: users.email,
          username: users.username,
          imageUrl: users.imageUrl,
          externalUserId: users.externalUserId,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(streams)
      .innerJoin(users, eq(streams.userId, users.id))
      .where(
        not(
          exists(
            db
              .select()
              .from(blockings)
              .where(
                and(
                  eq(blockings.blockedId, userId),
                  eq(blockings.blockerId, users.id)
                )
              )
          )
        )
      )
      .orderBy(desc(streams.isLive), desc(streams.updatedAt));
  } else {
    result = await db
      .select({
        id: streams.id,
        isLive: streams.isLive,
        title: streams.title,
        thumbnail: streams.thumbnail,
        user: {
          id: users.id,
          email: users.email,
          username: users.username,
          imageUrl: users.imageUrl,
          externalUserId: users.externalUserId,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(streams)
      .innerJoin(users, eq(streams.userId, users.id))
      .orderBy(desc(streams.isLive), desc(streams.updatedAt));
  }

  // Chuyển đổi isLive từ number (0/1) sang boolean (false/true)
  return result.map(stream => ({
    ...stream,
    isLive: Boolean(stream.isLive),
  }));
};