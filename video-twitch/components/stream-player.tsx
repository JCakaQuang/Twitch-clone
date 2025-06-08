'use client';

import { useViewerToken } from "@/hooks/use-viewer-token";

interface StreamPlayerUser {
    id: string;
    externalUserId: string;
    username: string;
    bio: string | null;
    imageUrl: string;
    _count: {
      followedBy: number;
    };
    stream: StreamPlayerStream | null;
}

interface StreamPlayerStream {
    id: string;
    isLive: number;
    isChatDelayed: number;
    isChatEnabled: number;
    isChatFollowersOnly: number;
    thumbnailUrl: string | null;
}

interface StreamPlayerProps {
    user: StreamPlayerUser;
    stream: StreamPlayerStream;
    isFollowing: boolean;
}

export const StreamPlayer = ({
    user,
    stream,
    isFollowing
}: StreamPlayerProps) => {

    const { token, name, identity } = useViewerToken(user.id);

    console.log({ token, name, identity });

    if (!token || !name || !identity) {
        return <div>
            Cannot watch stream. Please try again later.
        </div>;
    }

    return (
        <div>
            Allowed to watch stream: {user.username} <br />
            Stream is live: {stream.isLive ? "Yes" : "No"} <br />
        </div>
    );
};
