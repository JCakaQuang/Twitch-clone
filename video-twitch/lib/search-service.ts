import { db } from "@/src";
import { getSelf } from "@/lib/auth-service";
import { eq, desc, and, not, or, like } from "drizzle-orm";
import { streams, users } from "@/src/db/schema";

export const getSearch = async (term?: string) => {
  let userId: string | null = null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let result = [];

  // Tạo điều kiện tìm kiếm
  const searchConditions = [];
  
  if (term) {
    searchConditions.push(
      like(streams.title, `%${term}%`), // tìm trong title
      like(users.username, `%${term}%`) // tìm trong username
    );
  }

  if (userId) {
    // Với user đã đăng nhập - loại trừ streams của chính họ
    result = await db
      .select({
        id: streams.id,
        title: streams.title,
        isLive: streams.isLive,
        thumbnail: streams.thumbnail,
        updatedAt: streams.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          username: users.username,
          imageUrl: users.imageUrl,
          externalUserId: users.externalUserId,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(streams)
      .innerJoin(users, eq(streams.userId, users.id))
      .where(
        and(
          not(eq(users.id, userId)), // loại trừ streams của chính user
          searchConditions.length > 0 ? or(...searchConditions) : undefined
        )
      )
      .orderBy(desc(streams.isLive), desc(streams.updatedAt));
  } else {
    // Với guest user - không loại trừ gì
    result = await db
      .select({
        id: streams.id,
        title: streams.title,
        isLive: streams.isLive,
        thumbnail: streams.thumbnail,
        updatedAt: streams.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          username: users.username,
          imageUrl: users.imageUrl,
          externalUserId: users.externalUserId,
          bio: users.bio,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(streams)
      .innerJoin(users, eq(streams.userId, users.id))
      .where(
        searchConditions.length > 0 ? or(...searchConditions) : undefined
      )
      .orderBy(desc(streams.isLive), desc(streams.updatedAt));
  }

  // Chuyển đổi isLive từ number (0/1) sang boolean (false/true)
  return result.map(stream => ({
    ...stream,
    isLive: Boolean(stream.isLive),
  }));
};