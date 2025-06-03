import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
import { db } from "@/src";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const Actions = async () => {
  const user = await currentUser();

  // Nếu đã đăng nhập, kiểm tra username từ Turso để đồng bộ
  let username = user?.username;
  if (user && !username) {
    try {
      const userFromDb = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.externalUserId, user.id))
        .limit(1);
      if (userFromDb.length > 0) {
        username = userFromDb[0].username;
      }
    } catch (err) {
      console.error("Error fetching username from Turso:", err);
      username = "user-" + user.id; // Giá trị dự phòng nếu không tìm thấy
    }
  }

  return (
    <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
      {!user && (
        <SignInButton>
          <Button size="sm" variant="primary">
            Login
          </Button>
        </SignInButton>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={`/u/${username || "user-" + user.id}`}>
              <Clapperboard className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
};