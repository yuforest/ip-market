import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import { listings } from "../../../../lib/db/schema"

// 出品詳細取得API
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, params.id),
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error: any) {
    console.error("Failed to get listing:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 出品更新API
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      status,
      priceUsdc,
      escrowAddress,
    } = await req.json()

    const [listing] = await db
      .update(listings)
      .set({
        status,
        priceUsdc,
        escrowAddress,
        updatedAt: new Date(),
      })
      .where(eq(listings.id, params.id))
      .returning()

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error: any) {
    console.error("Failed to update listing:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 出品削除API
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [listing] = await db
      .delete(listings)
      .where(eq(listings.id, params.id))
      .returning()

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Listing deleted successfully" })
  } catch (error: any) {
    console.error("Failed to delete listing:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
