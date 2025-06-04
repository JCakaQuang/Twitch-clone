import { db } from "@/src";
import { users, streams, follows } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const getUserByUsername = async (username: string) => {
  const userRows = await db
    .select({
      id: users.id,
      externalUserId: users.externalUserId,
      username: users.username,
      bio: users.bio,
      imageUrl: users.imageUrl,
      stream: {
        id: streams.id,
        isLive: streams.isLive,
        isChatDelayed: streams.isChatDelayed,
        isChatEnabled: streams.isChatEnabled,
        isChatFollowersOnly: streams.isChatFollowersOnly,
        thumbnailUrl: streams.thumbnail,
      },
    })
    .from(users)
    .leftJoin(streams, eq(users.id, streams.userId))
    .where(eq(users.username, username));

  // nếu không tìm thấy user
  if (userRows.length === 0) return null;

  const countFollowedBy = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userRows[0].id))
    .then((rows) => rows.length);

  return {
    ...userRows[0],
    _count: {
      followedBy: countFollowedBy,
    },
  };
};


export const getUserById = async (id: string) => {
  const userRows = await db
    .select({
      id: users.id,
      externalUserId: users.externalUserId,
      username: users.username,
      bio: users.bio,
      imageUrl: users.imageUrl,
      stream: {
        id: streams.id,
        isLive: streams.isLive,
        isChatDelayed: streams.isChatDelayed,
        isChatEnabled: streams.isChatEnabled,
        isChatFollowersOnly: streams.isChatFollowersOnly,
        thumbnailUrl: streams.thumbnail,
      },
    })
    .from(users)
    .leftJoin(streams, eq(users.id, streams.userId))
    .where(eq(users.id, id));

  return userRows[0] || null;
};

