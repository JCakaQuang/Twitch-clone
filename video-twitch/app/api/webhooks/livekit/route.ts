import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { eq } from "drizzle-orm";

import { db } from "@/src";
import { streams } from "@/src/db/schema"; // Bạn cần định nghĩa schema này

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = headers();
  const authorization = (await headerPayload).get("Authorization");

  if (!authorization) {
    return new Response("No authorization header", { status: 400 });
  }

  const event = receiver.receive(body, authorization);

  const ingressId = event.ingressInfo?.ingressId;
  if (!ingressId) {
    return new Response("Missing ingress ID", { status: 400 });
  }

  if (event.event === "ingress_started") {
    await db
      .update(streams)
      .set({ isLive: 1 })
      .where(eq(streams.ingressId, ingressId));
  }

  if (event.event === "ingress_ended") {
    await db
      .update(streams)
      .set({ isLive: 0 })
      .where(eq(streams.ingressId, ingressId));
  }

  return new Response("ok", { status: 200 });
}
