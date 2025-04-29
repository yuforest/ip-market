import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req: NextAuthRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, session?.user?.id),
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    });

    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
})

