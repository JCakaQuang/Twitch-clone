"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { on } from "events";
import { onFollow, onUnfollow } from "@/actions/follow";
import { is } from "drizzle-orm";
// import { onFollow, onUnfollow } from "@/actions/follow";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({
    isFollowing,
    userId,
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();
    
    const handleFollow = () => {
        startTransition(() => {
            onFollow(userId)
                .then((data) => toast.success('You are now following ' + data.followingId.username + '!'))
                .catch(() => {
                    toast.error("Failed to follow user.");
            });
        });
    }
    
    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(userId)
                .then((data) => toast.success('You have unfollowed ' + data.following.username + '!'))
                .catch(() => {
                    toast.error("Failed to follow user.");
            });
        });
    }

    const onClick = isFollowing ? handleUnfollow : handleFollow;

    return (
      <>
        <Button 
        disabled={isPending}
        onClick={onClick} variant="primary">
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        {/* <Button onClick={handleBlock} disabled={isPending}>
          Block
        </Button> */}
      </>
    );
}


function setIsLoading(arg0: boolean) {
// Removed unused setIsLoading function
//   const [isPending, startTransition] = useTransition();



//     return (
//     <>
//       {/* <Button disabled={isPending} onClick={onClick} variant="primary">
//         {isFollowing ? "Unfollow" : "Follow"}
//       </Button> */}
//       {/* <Button onClick={handleBlock} disabled={isPending}>
//         Block
//       </Button> */}
//     </>
//   );
};