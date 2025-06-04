import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { users, streams, follows, blockings } from "@/src/db/schema";
import { and, desc, eq, ne, notInArray } from "drizzle-orm";

export const getRecommended = async () => {
  let userId: string | null = null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    // Chưa đăng nhập
  }

  let recommendedUsers = [];

  if (userId) {
    // Lấy danh sách following và blocking
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

    // Lọc users không phải bản thân, không bị follow, không bị block
    recommendedUsers = await db
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
          notInArray(users.id, [...followingIds, ...blockedIds])
        )
      )
      .orderBy(desc(users.createdAt));
  } else {
    // Nếu chưa đăng nhập → lấy toàn bộ
    recommendedUsers = await db
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

  return recommendedUsers.map((u) => ({
    id: u.id,
    username: u.username,
    imageUrl: u.imageUrl,
    createdAt: u.createdAt,
    stream: u.streamIsLive !== null && u.streamIsLive !== undefined
      ? { isLive: Boolean(u.streamIsLive) }
      : null,
  }));
};
