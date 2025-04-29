import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ProjectStatus } from "@/lib/db/enums"
import { nftProjects, projectDisclosures } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import type { NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"

// プロジェクト詳細取得API
export const GET = auth(async function GET(req: NextAuthRequest) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  try {
    // プロジェクト詳細を取得
    const project = await db.query.nftProjects.findFirst({
      where: and(
        eq(nftProjects.id, id),
        eq(nftProjects.ownerId, req.auth.user.id),
        ne(nftProjects.status, ProjectStatus.DELETED)
      ),
      with: {
        owner: true,
        listing: true,
        valuationReports: {
          orderBy: (reports, { desc }) => [desc(reports.createdAt)],
          limit: 1,
        },
        disclosures: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to get project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

// プロジェクト更新API
export const PUT = auth(async function PUT(req: NextAuthRequest) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  try {
    const body = await req.json()
    const {
      name,
      image,
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
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // プロジェクトの所有者確認
    const existingProject = await db.query.nftProjects.findFirst({
      where: and(
        eq(nftProjects.id, id),
        eq(nftProjects.ownerId, req.auth.user.id),
        ne(nftProjects.status, ProjectStatus.DELETED)
      ),
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // プロジェクトの更新
    const [project] = await db
      .update(nftProjects)
      .set({
        name,
        image,
        collectionAddress,
        chainId,
        description,
        category,
        royaltyPct: royaltyPct || null,
        ltmRevenueUSD: ltmRevenueUSD || null,
        metadataCID: metadataCID || null,
      })
      .where(eq(nftProjects.id, id))
      .returning()

    // 既存の開示情報を削除
    await db
      .delete(projectDisclosures)
      .where(eq(projectDisclosures.projectId, id))

    // 新しい開示情報を作成（存在する場合）
    if (disclosures && disclosures.length > 0) {
      const disclosureValues = disclosures.map((disclosure: any) => ({
        projectId: id,
        disclosureType: disclosure.disclosureType,
        title: disclosure.title,
        description: disclosure.description,
      }))

      await db.insert(projectDisclosures).values(disclosureValues)
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

// プロジェクト削除API
export const DELETE = auth(async function DELETE(req: NextAuthRequest) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  try {
    // プロジェクトの所有者確認
    const existingProject = await db.query.nftProjects.findFirst({
      where: and(
        eq(nftProjects.id, id),
        eq(nftProjects.ownerId, req.auth.user.id),
        ne(nftProjects.status, ProjectStatus.DELETED)
      ),
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const [project] = await db
      .update(nftProjects)
      .set({ status: ProjectStatus.DELETED })
      .where(eq(nftProjects.id, id))
      .returning()

    return NextResponse.json({ message: "Project marked as deleted" })
  } catch (error: any) {
    console.error("Failed to delete project:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})
