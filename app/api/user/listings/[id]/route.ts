import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

// Update listing API
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const listingId = params.id
    const { priceUSDC } = await req.json()

    // Update listing
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

// Delete listing API
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const listingId = params.id

    // Delete listing
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
