import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const POST = async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { avatar, username } = await req.json()

  await db.update(users).set({
    twitterProfileImageUrl: avatar,
    twitterUsername: username,
  }).where(eq(users.id, session.user.id))

  return NextResponse.json({ success: true }, { status: 200 })
}