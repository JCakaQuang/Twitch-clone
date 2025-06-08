import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { eq } from "drizzle-orm";

import { db } from "@/src";
import { streams } from "@/src/db/schema";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    return new Response("No authorization header", { status: 400 });
  }

  let event;

  try {
    event = await receiver.receive(body, authorization);
  } catch (err) {
    console.error("Error parsing webhook:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  const ingressId = event.ingressInfo?.ingressId;
  if (!ingressId) {
    return new Response("Missing ingress ID", { status: 400 });
  }

  if (event.event === "ingress_started") {
        console.log("Received eventttttttt:", event.event);
    await db
      .update(streams)
      .set({ isLive: 1 })
      .where(eq(streams.ingressId, ingressId));
  }

  if (event.event === "ingress_ended") {
        console.log("Received event:", event.event);
    await db
      .update(streams)
      .set({ isLive: 0 })
      .where(eq(streams.ingressId, ingressId));
  }

  

  return new Response("ok", { status: 200 });
}
