import { db } from "@/src";
import { eq, not, exists, and } from "drizzle-orm";
import { follows, users, blockings } from "@/src/db/schema";
import { getSelf } from "@/lib/auth-service";

export const getFollowedUser = async () => {
  try {
    const self = await getSelf();

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
          not(
            exists(
              db
                .select()
                .from(blockings)
                .where(
                  and(
                    eq(blockings.blockedId, self.id),
                    eq(blockings.blockerId, follows.followingId)
                  )
                )
            )
          )
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

  await db.insert(follows).values({
    id: randomUUID(),
    followerId: self.id,
    followingId: id,
  });

  return { success: true };
};


export const unfollowUser = async (id: string) => {
  const self = await getSelf();

  if (id === self.id) throw new Error("You can't unfollow yourself");

  const follow = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, self.id), eq(follows.followingId, id)))
    .limit(1);

  if (follow.length === 0) throw new Error("You are not following this user");

  await db.delete(follows).where(eq(follows.id, follow[0].id));

  return { success: true };
};

