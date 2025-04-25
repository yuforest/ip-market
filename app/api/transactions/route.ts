import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { listings, nftProjects, transactions } from "@/lib/db/schema"

// 取引作成API
export async function POST(req: NextRequest) {
  try {
    const { listingId, userId, priceUSDC, txHash } = await req.json()

    // 必須項目のバリデーション
    if (!listingId || !userId || !priceUSDC || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // トランザクションを開始
    const result = await db.transaction(async (tx) => {
      // 取引を作成
      const [transaction] = await tx
        .insert(transactions)
        .values({
          listingId,
          userId,
          priceUSDC,
          txHash,
        })
        .returning()

      // 出品のステータスを更新
      await tx.update(nftProjects).set({ status: "sold" }).where(eq(listings.id, listingId))

      return transaction
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
