"use server";

import { revalidatePath } from "next/cache";

import { followUser, unfollowUser } from "@/lib/follow-service";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followUser(id); // Gọi hàm followUser để theo dõi người dùng

    revalidatePath(`/`); // Đường dẫn đến trang chính, có thể là trang danh sách người dùng hoặc trang chủ

    if (followedUser) { // Đường dẫn đến trang cá nhân của người dùng đã theo dõi
      revalidatePath(`/${followedUser.followingId.username}`);
    }

    return followedUser; // Trả về thông tin người dùng đã theo dõi
  } catch (error) {
    throw new Error("Internal server error");
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const unfollowedUser = await unfollowUser(id); // Gọi hàm unfollowUser để hủy theo dõi người dùng

    revalidatePath(`/`); // Đường dẫn đến trang chính, có thể là trang danh sách người dùng hoặc trang chủ

    if (unfollowedUser) { // Đường dẫn đến trang cá nhân của người dùng đã hủy theo dõi
      revalidatePath(`/${unfollowedUser.following.username}`);
    }

    return unfollowedUser; // Trả về thông tin người dùng đã hủy theo dõi
  } catch (error) {
    throw new Error("Internal server error");
  }
}