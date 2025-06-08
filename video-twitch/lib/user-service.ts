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
        thumbnail: streams.thumbnail,
        title: streams.title,
      },
    })
    .from(users)
    .leftJoin(streams, eq(users.id, streams.userId))
    .where(eq(users.username, username));

  if (userRows.length === 0) return null;

  const countFollowedBy = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userRows[0].id as string))
    .then((rows) => rows.length);

  const user = userRows[0];

  return {
    ...user,
    stream: user.stream
      ? {
          id: user.stream.id,
          isLive: user.stream.isLive === 1,
          isChatDelayed: user.stream.isChatDelayed === 1,
          isChatEnabled: user.stream.isChatEnabled === 1,
          isChatFollowersOnly: user.stream.isChatFollowersOnly === 1,
          thumbnail: user.stream.thumbnail,
          title: user.stream.title,
        }
      : null,
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
        thumbnail: streams.thumbnail,
        title: streams.title,
      },
    })
    .from(users)
    .leftJoin(streams, eq(users.id, streams.userId))
    .where(eq(users.id, id));

  return userRows[0] || null;
};

