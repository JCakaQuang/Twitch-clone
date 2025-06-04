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
    // Lấy danh sách following
    const following = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    // Lấy danh sách người dùng bị bạn block
    const blockedByYou = await db
      .select({ blockedId: blockings.blockedId })
      .from(blockings)
      .where(eq(blockings.blockerId, userId));

    // Lấy danh sách người dùng block bạn
    const blockedYou = await db
      .select({ blockerId: blockings.blockerId })
      .from(blockings)
      .where(eq(blockings.blockedId, userId));

    const followingIds = following.map((f) => f.followingId);
    const blockedByYouIds = blockedByYou.map((b) => b.blockedId);
    const blockedYouIds = blockedYou.map((b) => b.blockerId);

    // Lọc users không phải bản thân, không bị follow, không bị block (cả hai chiều)
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
          notInArray(users.id, [...followingIds, ...blockedByYouIds, ...blockedYouIds])
        )
      )
      .orderBy(desc(users.createdAt))
      .limit(10); // Thêm limit để tối ưu hiệu suất
  } else {
    // Nếu chưa đăng nhập → lấy toàn bộ, không cần kiểm tra block
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
      .orderBy(desc(users.createdAt))
      .limit(10); // Thêm limit để tối ưu hiệu suất
  }

  return recommendedUsers.map((u) => ({
    id: u.id,
    username: u.username,
    imageUrl: u.imageUrl,
    createdAt: u.createdAt.getTime(),
    stream: u.streamIsLive !== null && u.streamIsLive !== undefined
      ? { isLive: Boolean(u.streamIsLive) }
      : null,
  }));
};
