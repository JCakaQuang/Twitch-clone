import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { users, blockings } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const isBlockedByUser = async (id: string) => {
  try {
    const self = await getSelf();

    // Kiểm tra xem người dùng mục tiêu có tồn tại
    const otherUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!otherUser.length) {
      throw new Error("User not found");
    }

    if (self.id === otherUser[0].id) {
      return false;
    }

    // Kiểm tra xem bạn có bị người dùng mục tiêu block không
    const existingBlock = await db
      .select({ id: blockings.id })
      .from(blockings)
      .where(
        and(
          eq(blockings.blockerId, otherUser[0].id),
          eq(blockings.blockedId, self.id)
        )
      )
      .limit(1);

    return existingBlock.length > 0;
  } catch {
    return false;
  }
};

export const isBlockingUser = async (id: string) => {
  try {
    const self = await getSelf();

    // Kiểm tra xem người dùng mục tiêu có tồn tại
    const otherUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!otherUser.length) {
      throw new Error("User not found");
    }

    if (self.id === otherUser[0].id) {
      return false;
    }

    // Kiểm tra xem bạn có block người dùng mục tiêu không
    const existingBlock = await db
      .select({ id: blockings.id })
      .from(blockings)
      .where(
        and(
          eq(blockings.blockerId, self.id),
          eq(blockings.blockedId, otherUser[0].id)
        )
      )
      .limit(1);

    return existingBlock.length > 0;
  } catch {
    return false;
  }
};

export const blockUser = async (id: string) => {
  const self = await getSelf();

  if (self.id === id) {
    throw new Error("You cannot block yourself");
  }

  // Kiểm tra xem người dùng mục tiêu có tồn tại
  const otherUser = await db
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!otherUser.length) {
    throw new Error("User not found");
  }

  // Kiểm tra xem đã block chưa
  const existingBlock = await db
    .select({ id: blockings.id })
    .from(blockings)
    .where(
      and(
        eq(blockings.blockerId, self.id),
        eq(blockings.blockedId, otherUser[0].id)
      )
    )
    .limit(1);

  if (existingBlock.length) {
    throw new Error("Already blocked");
  }

  // Tạo bản ghi block - Fixed: Added createdAt and updatedAt
  const blockId = randomUUID();
  const now = new Date();
  const block = await db
    .insert(blockings)
    .values({
      id: blockId,
      blockerId: self.id,
      blockedId: otherUser[0].id,
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      id: blockings.id,
      blockerId: blockings.blockerId,
      blockedId: blockings.blockedId,
    });

  return {
    id: block[0].id,
    blockerId: block[0].blockerId,
    blockedId: block[0].blockedId,
    blocked: {
      id: otherUser[0].id,
      username: otherUser[0].username,
    },
  };
};

export const unblockUser = async (id: string) => {
  const self = await getSelf();

  // Kiểm tra xem người dùng mục tiêu có tồn tại
  const otherUser = await db
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!otherUser.length) {
    throw new Error("User not found");
  }

  // Kiểm tra xem có block không
  const existingBlock = await db
    .select({ id: blockings.id })
    .from(blockings)
    .where(
      and(
        eq(blockings.blockerId, self.id),
        eq(blockings.blockedId, otherUser[0].id)
      )
    )
    .limit(1);

  if (!existingBlock.length) {
    throw new Error("Not blocked");
  }

  // Xóa bản ghi block
  const unblock = await db
    .delete(blockings)
    .where(eq(blockings.id, existingBlock[0].id))
    .returning({
      id: blockings.id,
      blockerId: blockings.blockerId,
      blockedId: blockings.blockedId,
    });

  return {
    id: unblock[0].id,
    blockerId: unblock[0].blockerId,
    blockedId: unblock[0].blockedId,
    blocked: {
      id: otherUser[0].id,
      username: otherUser[0].username,
    },
  };
};

// Updated getBlockedUsers function to include imageUrl and other user data
export const getBlockedUsers = async () => {
  const self = await getSelf();

  // Lấy danh sách người dùng bị block với thêm thông tin
  const blockedUsers = await db
    .select({
      id: blockings.id,
      blockerId: blockings.blockerId,
      blockedId: blockings.blockedId,
      createdAt: blockings.createdAt,
      updatedAt: blockings.updatedAt,
      blocked: {
        id: users.id,
        username: users.username,
        imageUrl: users.imageUrl, // Add this if it exists in your schema
        // Add other user fields as needed
      },
    })
    .from(blockings)
    .leftJoin(users, eq(blockings.blockedId, users.id))
    .where(eq(blockings.blockerId, self.id));

  return blockedUsers.map((block) => ({
    id: block.id,
    blockerId: block.blockerId,
    blockedId: block.blockedId,
    createdAt: block.createdAt,
    updatedAt: block.updatedAt,
    blocked: block.blocked
      ? {
          id: block.blocked.id,
          username: block.blocked.username,
          imageUrl: block.blocked.imageUrl,
        }
      : null,
  }));
};