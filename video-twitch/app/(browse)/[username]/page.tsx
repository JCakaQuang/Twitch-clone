import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser, isBlockingUser } from "@/lib/block-service";
import { Actions } from "./_components/actions";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

const UserPage = async ({ params }: UserPageProps) => {
  try {
    const resolvedParams = await params;
    const username = resolvedParams.username;

    const startUser = Date.now();
    const user = await getUserByUsername(username);
    console.log("getUserByUsername took:", Date.now() - startUser, "ms");

    if (!user) {
      notFound();
    }

    const startFollowing = Date.now();
    const isFollowing = await isFollowingUser(user.id);
    console.log("isFollowingUser took:", Date.now() - startFollowing, "ms");

    const startBlockedBy = Date.now();
    const isBlockedBy = await isBlockedByUser(user.id);
    console.log("isBlockedByUser took:", Date.now() - startBlockedBy, "ms");

    const startBlocking = Date.now();
    const isBlocking = await isBlockingUser(user.id);
    console.log("isBlockingUser took:", Date.now() - startBlocking, "ms");

    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        {isBlockedBy ? (
          <p className="text-red-500">Bạn bị người dùng này block.</p>
        ) : isBlocking ? (
          <p className="text-red-500">Bạn đã block người dùng này.</p>
        ) : (
          <>
            <p>username: {user.username}</p>
            <p>userID: {user.id}</p>
            <p>is following: {isFollowing ? "Yes" : "No"}</p>
          </>
        )}
        <Actions
          isBlockedBy={isBlockedBy}
          isBlocking={isBlocking}
          isFollowing={isFollowing}
          userId={user.id}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in UserPage:", error);
    notFound();
  }
};

export default UserPage;