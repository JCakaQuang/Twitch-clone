import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { Actions } from "./_components/actions";
// import { isBlockedByUser } from "@/lib/block-service";
// import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  // Nếu không có user hoặc user chưa có stream thì trả về 404
  if (!user ) { //|| !user.stream
    notFound();
  }

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

};

export default UserPage;
