"use server";

import { AccessToken } from "livekit-server-sdk";
import { getSelf } from "@/lib/auth-service";
import { getUserById } from "@/lib/user-service";
import { isBlockedByUser } from "@/lib/block-service";

export const createViewerToken = async (hostIdentity: string) => {
  let self;

  try {
    self = await getSelf();
  } catch {
    // Tạo guest user với string ID thay vì ObjectId
    const guestId = `guest-${Math.floor(Math.random() * 100000)}`;
    const username = `guest-${Math.floor(Math.random() * 100000)}`;
    self = { id: guestId, username };
  }

  const host = await getUserById(hostIdentity);
  if (!host) {
    throw new Error("Host not found");
  }

  const isBlocked = await isBlockedByUser(host.id);
  if (isBlocked) {
    throw new Error("User is blocked");
  }

  const isHost = self.id.toString() === host.id.toString();

  // Consistent identity format
  const viewerIdentity = isHost ? `host-${host.id}` : `viewer-${self.id}`;
  
  console.log("=== TOKEN DEBUG ===");
  console.log("Host ID:", host.id);
  console.log("Self ID:", self.id);
  console.log("Is Host:", isHost);
  console.log("Viewer Identity:", viewerIdentity);
  console.log("Room Name:", host.id);

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: viewerIdentity,
      name: self.username,
    }
  );

  token.addGrant({
    room: host.id.toString(), // Ensure string
    roomJoin: true,
    canPublish: isHost, // Host có thể publish
    canSubscribe: true, // Tất cả có thể subscribe
    canPublishData: true,
  });

  return await token.toJwt();
};