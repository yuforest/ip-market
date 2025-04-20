import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import { nftProjects } from "../../../../lib/db/schema"

// NFTプロジェクト詳細取得API
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.query.nftProjects.findFirst({
      where: eq(nftProjects.id, params.id),
    })

    if (!project) {
      return NextResponse.json({ error: "NFT project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to get NFT project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// NFTプロジェクト更新API
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      name,
      collectionAddress,
      chainId,
      description,
      category,
      royaltyPct,
      ltmRevenueUsd,
      ownerId,
    } = await req.json()

    const [project] = await db
      .update(nftProjects)
      .set({
        name,
        collectionAddress,
        chainId,
        description,
        category,
        royaltyPct,
        ltmRevenueUsd,
        ownerId,
        updatedAt: new Date(),
      })
      .where(eq(nftProjects.id, params.id))
      .returning()

    if (!project) {
      return NextResponse.json({ error: "NFT project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to update NFT project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// NFTプロジェクト削除API
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [project] = await db
      .delete(nftProjects)
      .where(eq(nftProjects.id, params.id))
      .returning()

    if (!project) {
      return NextResponse.json({ error: "NFT project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "NFT project deleted successfully" })
  } catch (error: any) {
    console.error("Failed to delete NFT project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 