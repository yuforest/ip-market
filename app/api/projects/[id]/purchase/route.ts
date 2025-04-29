import { auth } from "@/auth"
import { db } from "@/lib/db"
import { listings, nftProjects, notifications, transactions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = await props.params
    const userId = session.user.id
    const projectId = params.id
    const { txHash } = await req.json()
    
    const project = await db.query.nftProjects.findFirst({
      where: eq(nftProjects.id, projectId),
    })
    const listing = await db.query.listings.findFirst({
      where: eq(listings.projectId, projectId),
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    if (project.status !== "active") {
      return NextResponse.json({ error: "Listing is not active" }, { status: 400 })
    }

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Create transaction
      const [transaction] = await tx
        .insert(transactions)
        .values({
          listingId: listing.id,
          userId,
          priceUSDC: listing.priceUSDC,
          txHash,
        })
        .returning()

      // Update project status
      await tx
        .update(nftProjects)
        .set({ status: "sold" })
        .where(eq(nftProjects.id, projectId))

      // Send notification to seller
      await tx
        .insert(notifications)
        .values({
          userId: project.ownerId!,
          type: "purchase",
          title: "NFT Purchased",
          message: `Your NFT project "${project.name}" has been purchased.`,
          projectId: project.id,
          metadata: {},
        })

      return transaction
    })

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error("Failed to create transaction:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
