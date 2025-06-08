import { StreamPlayer } from "@/components/stream-player";
import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";

interface CreatorPageProps {
    params: Promise<{
        username: string;
    }>;
}

const CreatorPage = async (props: CreatorPageProps) => {
    const params = await props.params;
    const externalUser = await currentUser();
    const user = await getUserByUsername(params.username);

    if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
        throw new Error("Unauthorized access or user not found");
    }

    return (
        <div className="h-full">
            <StreamPlayer
                user = {user}
                stream = {user.stream}
                isFollowing
            />
        </div>
    );
}

export default CreatorPage;