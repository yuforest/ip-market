import { and, eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { listings, transactions } from "../../../lib/db/schema"

// 取引作成API
export async function POST(req: NextRequest) {
  try {
    const { listingId, buyerWalletId, priceUSDC, txHash } = await req.json()

    // 必須項目のバリデーション
    if (!listingId || !buyerWalletId || !priceUSDC || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // トランザクションを開始
    const result = await db.transaction(async (tx) => {
      // 取引を作成
      const [transaction] = await tx
        .insert(transactions)
        .values({
          listingId,
          buyerWalletId,
          priceUSDC,
          txHash,
        })
        .returning()

      // 出品のステータスを更新
      await tx.update(listings).set({ status: "sold" }).where(eq(listings.id, listingId))

      return transaction
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 取引一覧取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const buyerWalletId = url.searchParams.get("buyerWalletId")
    const listingId = url.searchParams.get("listingId")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // クエリ条件を構築
    const conditions = []

    if (buyerWalletId) {
      conditions.push(eq(transactions.buyerWalletId, buyerWalletId))
    }

    if (listingId) {
      conditions.push(eq(transactions.listingId, listingId))
    }

    // 取引一覧を取得
    const transactionsResult = await db.query.transactions.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        listing: {
          with: {
            project: true,
            sellerWallet: {
              with: {
                user: true,
              },
            },
          },
        },
        buyerWallet: {
          with: {
            user: true,
          },
        },
      },
      limit,
      offset,
      orderBy: (transactions, { desc }) => [desc(transactions.executedAt)],
    })

    // 総件数を取得
    const [{ count }] = await db
      .select({ count: count() })
      .from(transactions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return NextResponse.json({
      transactions: transactionsResult,
      pagination: {
        total: Number(count),
        limit,
        offset,
      },
    })
  } catch (error: any) {
    console.error("Failed to get transactions:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
