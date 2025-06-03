import { getRecommendedUsers } from "@/lib/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await getRecommendedUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}