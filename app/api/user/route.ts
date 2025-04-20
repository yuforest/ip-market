import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { users, wallets } from "../../../lib/db/schema"

// ユーザー作成API
export async function POST(req: NextRequest) {
  try {
    const { did, walletAddress, chainId } = await req.json()
    // userType パラメータを削除

    // DIDとウォレット情報が必須
    if (!did || !walletAddress || !chainId) {
      return NextResponse.json({ error: "DID, wallet address, and chain ID are required" }, { status: 400 })
    }

    // トランザクションを開始
    const result = await db.transaction(async (tx) => {
      // ユーザーを作成（userType フィールドなし）
      const [user] = await tx
        .insert(users)
        .values({
          did,
          // userType フィールドを削除
        })
        .returning()

      // ウォレットを作成（必須）
      await tx.insert(wallets).values({
        address: walletAddress,
        chainId,
        userId: user.id,
        isPrimary: true,
      })

      return user
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ユーザー取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const did = url.searchParams.get("did")
    const userId = url.searchParams.get("userId")

    if (!did && !userId) {
      return NextResponse.json({ error: "Either DID or userId is required" }, { status: 400 })
    }

    let user

    if (did) {
      // DIDでユーザーを検索
      user = await db.query.users.findFirst({
        where: eq(users.did, did),
        with: {
          wallets: true,
        },
      })
    } else if (userId) {
      // ユーザーIDでユーザーを検索
      user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
          wallets: true,
        },
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
