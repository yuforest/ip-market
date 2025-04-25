import { and, eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"

// 出品一覧取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const projectId = url.searchParams.get("projectId")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // クエリ条件を構築
    const conditions = []

    if (projectId) {
      conditions.push(eq(listings.projectId, projectId))
    }

    // 出品一覧を取得
    const listingsResult = await db.query.listings.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        project: true,
        transaction: true,
      },
      limit,
      offset,
      orderBy: (listings, { desc }) => [desc(listings.listedAt)],
    })

    // 総件数を取得
    const [{ count }] = await db
      .select({ count: count() })
      .from(listings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return NextResponse.json({
      listings: listingsResult,
      pagination: {
        total: Number(count),
        limit,
        offset,
      },
    })
  } catch (error: any) {
    console.error("Failed to get listings:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
