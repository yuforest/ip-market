import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { users } from "../../../lib/db/schema"

// ユーザー作成API
export async function POST(req: NextRequest) {
  try {
    const { dynamicUserId } = await req.json()

    if (!dynamicUserId) {
      return NextResponse.json({ error: "dynamicUserId is required" }, { status: 400 })
    }

    const [user] = await db
      .insert(users)
      .values({
        dynamicUserId,
      })
      .returning()

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ユーザー取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const dynamicUserId = url.searchParams.get("dynamicUserId")
    const userId = url.searchParams.get("userId")

    if (!dynamicUserId && !userId) {
      return NextResponse.json({ error: "Either dynamicUserId or userId is required" }, { status: 400 })
    }

    let user

    if (dynamicUserId) {
      user = await db.query.users.findFirst({
        where: eq(users.dynamicUserId, dynamicUserId),
      })
    } else if (userId) {
      user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Failed to get user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
