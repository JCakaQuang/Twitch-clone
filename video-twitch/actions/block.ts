"use server";

import { revalidatePath } from "next/cache";
import { getSelf } from "@/lib/auth-service";
import { blockUser, unblockUser } from "@/lib/block-service";

export const onBlock = async (id: string) => {
  try {
    const blockedUser = await blockUser(id);

    // Revalidate relevant paths
    revalidatePath(`/u/${blockedUser.blocked.username}`); // Profile của người bị chặn
    revalidatePath("/settings/blocked"); // Trang danh sách người bị chặn (nếu có)

    return blockedUser;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to block user");
  }
};

export const onUnblock = async (id: string) => {
  try {
    const unblockedUser = await unblockUser(id);

    // Revalidate relevant paths
    revalidatePath(`/u/${unblockedUser.blocked.username}`); // Profile của người được bỏ chặn
    revalidatePath("/settings/blocked"); // Trang danh sách người bị chặn

    return unblockedUser;
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to unblock user");
  }
};