import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { Actions } from "./_components/actions";
// import { isBlockedByUser } from "@/lib/block-service";
// import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

const UserPage = async ({ params }: UserPageProps) => {
  try {
    const resolvedParams = await params;
    const username = resolvedParams.username;

    const user = await getUserByUsername(username);

  // Nếu không có user hoặc user chưa có stream thì trả về 404
  if (!user ) { 
    notFound();
  }
//|| !user.stream
  const isFollowing = await isFollowingUser(user.id);
  // const isBlocked = await isBlockedByUser(user.id);

  // Nếu user bị block thì cũng trả về 404
  // if (isBlocked) {
  //   notFound();
  // }

  return (
     <div className="flex flex-col items-center justify-center h-full space-y-4">
      <p>username: {user.username} </p>
      <p>userID: {user.id} </p>
      <p>is following: {isFollowing ? "Yes" : "No"} </p>
      <Actions isFollowing={isFollowing} userId={user.id} />
    </div>
    // <StreamPlayer user={user} stream={user.stream} isFollowing={isFollowing} />
  );
  } catch (error) {
    console.error("Error in UserPage:", error);
    notFound();
  }

};

export default UserPage;
