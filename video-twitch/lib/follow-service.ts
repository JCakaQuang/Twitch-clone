import { db } from "@/src";
import { eq, not, exists, and, notInArray } from "drizzle-orm";
import { follows, users, blockings } from "@/src/db/schema";
import { getSelf } from "@/lib/auth-service";

export const getFollowedUser = async () => {
  try {
    const self = await getSelf();

    // Lấy danh sách người dùng bị bạn block
    const blockedByYou = await db
      .select({ blockedId: blockings.blockedId })
      .from(blockings)
      .where(eq(blockings.blockerId, self.id));

    // Lấy danh sách người dùng block bạn
    const blockedYou = await db
      .select({ blockerId: blockings.blockerId })
      .from(blockings)
      .where(eq(blockings.blockedId, self.id));

    const blockedByYouIds = blockedByYou.map((b) => b.blockedId);
    const blockedYouIds = blockedYou.map((b) => b.blockerId);

    const followedUsers = await db
      .select({
        followId: follows.id,
        followingUser: users,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(
        and(
          eq(follows.followerId, self.id),
          notInArray(follows.followingId, [...blockedByYouIds, ...blockedYouIds])
        )
      );

    return followedUsers;
  } catch (error) {
    return [];
  }
};

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();

    if (id === self.id) return true;

    const result = await db
      .select()
      .from(follows)
      .where(
        and(eq(follows.followerId, self.id), eq(follows.followingId, id))
      )
      .limit(1);

    return result.length > 0;
  } catch {
    return false;
  }
};

import { randomUUID } from "crypto"; // hoặc nanoid

export const followUser = async (id: string) => {
  const self = await getSelf();

  if (id === self.id) throw new Error("You can't follow yourself");

  const already = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, self.id), eq(follows.followingId, id)))
    .limit(1);

  if (already.length > 0) throw new Error("You are already following this user");

  const newFollowId = randomUUID();

  await db.insert(follows).values({
    id: newFollowId,
    followerId: self.id,
    followingId: id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Lấy thông tin người vừa được follow
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return {
    followingId: user, // để giống cấu trúc Prisma
    followerId: self,
  };
};

export const unfollowUser = async (id: string) => {
  const self = await getSelf();

  if (id === self.id) throw new Error("You can't unfollow yourself");

  // Kiểm tra tồn tại follow
  const follow = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, self.id), eq(follows.followingId, id)))
    .limit(1);

  if (follow.length === 0) throw new Error("You are not following this user");

  // Lấy thông tin người dùng được unfollow
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  // Xóa record follow
  await db.delete(follows).where(eq(follows.id, follow[0].id));

  // Trả về để tái tạo lại cấu trúc tương tự Prisma
  return {
    following: user,
  };
};



