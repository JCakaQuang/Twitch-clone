import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { users, streams, follows, blockings } from "@/src/db/schema";
import { and, desc, eq, ne, notInArray } from "drizzle-orm";
import { UserWithStream } from "@/lib/types";

export const getRecommended = async (): Promise<UserWithStream[]> => {
  let userId: string | null = null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let usersList;

  if (userId) {
    const following = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    const blocked = await db
      .select({ blockedId: blockings.blockedId })
      .from(blockings)
      .where(eq(blockings.blockerId, userId));

    const followingIds = following.map((f) => f.followingId);
    const blockedIds = blocked.map((b) => b.blockedId);

    usersList = await db
      .select({
        id: users.id,
        username: users.username,
        imageUrl: users.imageUrl,
        createdAt: users.createdAt,
        streamIsLive: streams.isLive,
      })
      .from(users)
      .leftJoin(streams, eq(users.id, streams.userId))
      .where(
        and(
          ne(users.id, userId),
          followingIds.length > 0 || blockedIds.length > 0
            ? notInArray(users.id, [...followingIds, ...blockedIds])
            : undefined
        )
      )
      .orderBy(desc(users.createdAt));
  } else {
    usersList = await db
      .select({
        id: users.id,
        username: users.username,
        imageUrl: users.imageUrl,
        createdAt: users.createdAt,
        streamIsLive: streams.isLive,
      })
      .from(users)
      .leftJoin(streams, eq(users.id, streams.userId))
      .orderBy(desc(users.createdAt));
  }

  return usersList.map((u) => ({
    id: u.id,
    username: u.username,
    imageUrl: u.imageUrl,
    createdAt: u.createdAt instanceof Date ? u.createdAt.getTime() : u.createdAt,
    stream:
      u.streamIsLive !== undefined && u.streamIsLive !== null
        ? { isLive: u.streamIsLive === 1 }
        : null,
  }));
};