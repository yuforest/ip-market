import { and, eq, ne } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { listings, nftProjects, projectDisclosures } from "@/lib/db/schema"
import { ProjectStatus } from "@/lib/db/enums"
import type { NextAuthRequest } from "next-auth"

// プロジェクト一覧取得API
export const GET = auth(async function GET(req: NextAuthRequest) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // クエリ条件を構築
    const conditions = [
      ne(nftProjects.status, ProjectStatus.DELETED),
      eq(nftProjects.ownerId, req.auth.user.id)
    ]

    // プロジェクト一覧を取得
    const projects = await db.query.nftProjects.findMany({
      where: and(...conditions),
      with: {
        owner: true,
        valuationReports: {
          orderBy: (reports, { desc }) => [desc(reports.generatedAt)],
          limit: 1,
        },
        listings: {
          where: eq(listings.status, "active"),
          limit: 1,
        },
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })

    return NextResponse.json({ projects })
  } catch (error: any) {
    console.error("Failed to get projects:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

// プロジェクト作成API
export const POST = auth(async function POST(req: NextAuthRequest) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      name,
      collectionAddress,
      chainId,
      description,
      category,
      royaltyPct,
      ltmRevenueUSD,
      metadataCID,
      disclosures,
    } = body

    // 必須フィールドのバリデーション
    if (!name || !collectionAddress || !chainId || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // プロジェクトの作成
    const [project] = await db
      .insert(nftProjects)
      .values({
        name,
        collectionAddress,
        chainId,
        description,
        category,
        royaltyPct: royaltyPct || null,
        ltmRevenueUSD: ltmRevenueUSD || null,
        metadataCID: metadataCID || null,
        ownerId: req.auth.user.id,
        status: ProjectStatus.DRAFT,
      })
      .returning()

    // 開示情報の作成（存在する場合）
    if (disclosures && disclosures.length > 0) {
      const disclosureValues = disclosures.map((disclosure: any) => ({
        projectId: project.id,
        disclosureType: disclosure.disclosureType,
        title: disclosure.title,
        description: disclosure.description,
      }))

      await db.insert(projectDisclosures).values(disclosureValues)
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
