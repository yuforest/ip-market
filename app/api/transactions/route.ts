import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { transactions } from "../../../lib/db/schema"

// 取引作成API
export async function POST(req: NextRequest) {
  try {
    const {
      listingId,
      buyerWalletAddress,
      buyerId,
      priceUsdc,
      txHash,
    } = await req.json()

    if (!listingId || !buyerWalletAddress || !buyerId || !priceUsdc || !txHash) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      )
    }

    const [transaction] = await db
      .insert(transactions)
      .values({
        listingId,
        buyerWalletAddress,
        buyerId,
        priceUsdc,
        txHash,
      })
      .returning()

    return NextResponse.json(transaction)
  } catch (error: any) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 取引取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const txId = url.searchParams.get("txId")
    const listingId = url.searchParams.get("listingId")

    if (!txId && !listingId) {
      return NextResponse.json(
        { error: "Either txId or listingId is required" },
        { status: 400 }
      )
    }

    let transaction

    if (txId) {
      transaction = await db.query.transactions.findFirst({
        where: eq(transactions.txId, txId),
      })
    } else if (listingId) {
      transaction = await db.query.transactions.findFirst({
        where: eq(transactions.listingId, listingId),
      })
    }

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error: any) {
    console.error("Failed to get transaction:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
