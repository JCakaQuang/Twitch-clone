"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/actions/follow";
import { onBlock, onUnblock } from "@/actions/block";

interface ActionsProps {
  isBlockedBy: boolean; // Bạn bị người dùng này block
  isBlocking: boolean; // Bạn block người dùng này
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({
  isBlockedBy,
  isBlocking,
  isFollowing,
  userId,
}: ActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.followingId.username}!`)
        )
        .catch(() => toast.error("Failed to follow user."));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}!`)
        )
        .catch(() => toast.error("Failed to unfollow user."));
    });
  };

  const onClick = isFollowing ? handleUnfollow : handleFollow;

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) => toast.success(`Blocked the user ${data.blocked.username}`))
        .catch((error) =>
          toast.error(
            error.message === "Already blocked"
              ? "Bạn đã block người dùng này rồi"
              : "Something went wrong"
          )
        );
    });
  };

  const handleUnblock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((data) =>
          toast.success(`Unblocked the user ${data.blocked.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  // Nếu bị block, không cho phép tương tác
  if (isBlockedBy) {
    return (
      <p className="text-red-500">Bạn bị người dùng này block, không thể tương tác.</p>
    );
  }

  return (
    <>
      <Button disabled={isPending || isBlocking} onClick={onClick} variant="primary">
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      {isBlocking ? (
        <Button
          disabled={isPending}
          onClick={handleUnblock}
          variant="destructive"
        >
          Unblock
        </Button>
      ) : (
        <Button disabled={isPending} onClick={handleBlock} variant="destructive">
          Block
        </Button>
      )}
    </>
  );
};