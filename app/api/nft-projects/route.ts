import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { nftProjects } from "../../../lib/db/schema"

// NFTプロジェクト作成API
export async function POST(req: NextRequest) {
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

    if (!name || !collectionAddress || !chainId || !category || !royaltyPct || !ownerId) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      )
    }

    const [project] = await db
      .insert(nftProjects)
      .values({
        name,
        collectionAddress,
        chainId,
        description,
        category,
        royaltyPct,
        ltmRevenueUsd,
        ownerId,
      })
      .returning()

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to create NFT project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// NFTプロジェクト取得API
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const projectId = url.searchParams.get("projectId")
    const ownerId = url.searchParams.get("ownerId")

    if (!projectId && !ownerId) {
      return NextResponse.json(
        { error: "Either projectId or ownerId is required" },
        { status: 400 }
      )
    }

    let projects

    if (projectId) {
      projects = await db.query.nftProjects.findFirst({
        where: eq(nftProjects.id, projectId),
      })
    } else if (ownerId) {
      projects = await db.query.nftProjects.findMany({
        where: eq(nftProjects.ownerId, ownerId),
      })
    }

    if (!projects) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error("Failed to get NFT projects:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 