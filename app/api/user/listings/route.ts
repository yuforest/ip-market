import { db } from "@/lib/db"
import { listings } from "@/lib/db/schema"
import { type NextRequest, NextResponse } from "next/server"

// Create listing API
export async function POST(req: NextRequest) {
  try {
    const { projectId, priceUSDC, saleId, escrowAddress } = await req.json()
    console.log(projectId)
    console.log(priceUSDC)
    console.log(escrowAddress)
    // Validate required fields
    if (!projectId || !priceUSDC) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create listing
    const [listing] = await db
      .insert(listings)
      .values({
        projectId,
        priceUSDC,
        saleId,
        escrowAddress,
      })
      .returning()

    return NextResponse.json(listing)
  } catch (error: any) {
    console.error("Failed to create listing:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
