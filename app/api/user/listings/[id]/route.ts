import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

// 出品更新API
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const listingId = params.id
    const { priceUSDC } = await req.json()

    // 出品を更新
    const [updatedListing] = await db
      .update(listings)
      .set({
        priceUSDC,
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
