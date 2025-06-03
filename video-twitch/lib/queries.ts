import { db } from "@/src";
import { users, streams } from "@/src/db/schema";
import { eq } from "drizzle-orm";

// Lấy danh sách người dùng được đề xuất kèm trạng thái isLive
export async function getRecommendedUsers() {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      imageUrl: users.imageUrl,
      externalUserId: users.externalUserId,
      bio: users.bio,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      stream: {
        isLive: streams.isLive,
      },
    })
    .from(users)
    .leftJoin(streams, eq(users.id, streams.userId)) // Join để lấy thông tin stream, leftJoin vì stream có thể null
    .limit(10); // Giới hạn số lượng người dùng được đề xuất, điều chỉnh theo nhu cầu

  return result;
}