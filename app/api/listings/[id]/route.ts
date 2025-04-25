import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import { listings } from "../../../../lib/db/schema"

// 出品詳細取得API
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const listingId = params.id

    // 出品詳細を取得
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, listingId),
      with: {
        project: {
          with: {
            valuationReports: {
              orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
              limit: 1,
            },
            disclosures: true,
          },
        },
        transaction: {
          with: {
            user: true,
          },
        },
      },
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
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const listingId = params.id
    const { priceUSDC, escrowAddress } = await req.json()

    // 出品を更新
    const [updatedListing] = await db
      .update(listings)
      .set({
        priceUSDC,
        escrowAddress,
      })
      .where(eq(listings.id, listingId))
      .returning()

    if (!updatedListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(updatedListing)
  } catch (error: any) {
    console.error("Failed to update listing:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 出品削除API
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const listingId = params.id

    // 出品を削除
    const [deletedListing] = await db.delete(listings).where(eq(listings.id, listingId)).returning()

    if (!deletedListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete listing:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
