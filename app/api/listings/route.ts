import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"

// 出品作成API
export async function POST(req: NextRequest) {
  try {
    const { projectId, priceUSDC, escrowAddress } = await req.json()
    console.log(projectId)
    console.log(priceUSDC)
    console.log(escrowAddress)
    // 必須項目のバリデーション
    if (!projectId || !priceUSDC) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 出品を作成
    const [listing] = await db
      .insert(listings)
      .values({
        projectId,
        priceUSDC,
        escrowAddress,
      })
      .returning()

    return NextResponse.json(listing)
  } catch (error: any) {
    console.error("Failed to create listing:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
