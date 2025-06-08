import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { users, blockings } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const isBlockedByUser = async (id: string) => {
  try {
    console.log(`[DEBUG] Checking if user ${id} blocked current user`);
    const self = await getSelf();
    console.log(`[DEBUG] Current user: ${self.id}`);

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

    const isBlocked = existingBlock.length > 0;
    console.log(`[DEBUG] Is blocked by ${id}: ${isBlocked}`);
    return isBlocked;
  } catch (error) {
    console.error(`[ERROR] isBlockedByUser:`, error);
    return false;
  }
};

export const isBlockingUser = async (id: string) => {
  try {
    console.log(`[DEBUG] Checking if current user is blocking ${id}`);
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

    const isBlocking = existingBlock.length > 0;
    console.log(`[DEBUG] Current user is blocking ${id}: ${isBlocking}`);
    return isBlocking;
  } catch (error) {
    console.error(`[ERROR] isBlockingUser:`, error);
    return false;
  }
};

export const blockUser = async (id: string) => {
  try {
    console.log(`[DEBUG] Starting blockUser for ${id}`);
    const self = await getSelf();
    console.log(`[DEBUG] Current user: ${self.id}`);

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

    console.log(`[DEBUG] Target user found: ${otherUser[0].username}`);

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
      console.log(`[DEBUG] User already blocked`);
      throw new Error("Already blocked");
    }

    // Tạo bản ghi block
    const blockId = randomUUID();
    const now = new Date();
    
    console.log(`[DEBUG] Creating block record with ID: ${blockId}`);
    console.log(`[DEBUG] Block data:`, {
      id: blockId,
      blockerId: self.id,
      blockedId: otherUser[0].id,
      createdAt: now,
      updatedAt: now,
    });

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
        createdAt: blockings.createdAt,
      });

    console.log(`[DEBUG] Block created successfully:`, block[0]);

    // Verify the block was created
    const verifyBlock = await db
      .select({ id: blockings.id })
      .from(blockings)
      .where(eq(blockings.id, blockId))
      .limit(1);

    console.log(`[DEBUG] Verification - Block exists in DB: ${verifyBlock.length > 0}`);

    return {
      id: block[0].id,
      blockerId: block[0].blockerId,
      blockedId: block[0].blockedId,
      createdAt: block[0].createdAt,
      blocked: {
        id: otherUser[0].id,
        username: otherUser[0].username,
      },
    };
  } catch (error) {
    console.error(`[ERROR] blockUser failed:`, error);
    throw error;
  }
};

export const unblockUser = async (id: string) => {
  try {
    console.log(`[DEBUG] Starting unblockUser for ${id}`);
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
      console.log(`[DEBUG] No block found to remove`);
      throw new Error("Not blocked");
    }

    console.log(`[DEBUG] Removing block with ID: ${existingBlock[0].id}`);

    // Xóa bản ghi block
    const unblock = await db
      .delete(blockings)
      .where(eq(blockings.id, existingBlock[0].id))
      .returning({
        id: blockings.id,
        blockerId: blockings.blockerId,
        blockedId: blockings.blockedId,
      });

    console.log(`[DEBUG] Unblock successful:`, unblock[0]);

    return {
      id: unblock[0].id,
      blockerId: unblock[0].blockerId,
      blockedId: unblock[0].blockedId,
      blocked: {
        id: otherUser[0].id,
        username: otherUser[0].username,
      },
    };
  } catch (error) {
    console.error(`[ERROR] unblockUser failed:`, error);
    throw error;
  }
};

export const getBlockedUsers = async () => {
  try {
    console.log(`[DEBUG] Getting blocked users list`);
    const self = await getSelf();

    // Lấy danh sách người dùng bị block
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
        imageUrl: users.imageUrl, // 👈 Thêm dòng này
      },
    })
    .from(blockings)
    .leftJoin(users, eq(blockings.blockedId, users.id))
    .where(eq(blockings.blockerId, self.id));

    console.log(`[DEBUG] Found ${blockedUsers.length} blocked users`);

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
            imageUrl: block.blocked.imageUrl, // 👈 Thêm dòng này
          }
        : null,
    }));
  } catch (error) {
    console.error(`[ERROR] getBlockedUsers failed:`, error);
    return [];
  }
};