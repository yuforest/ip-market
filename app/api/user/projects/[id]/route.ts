import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ProjectStatus } from "@/lib/db/enums"
import { nftProjects, projectDisclosures } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import type { NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"

// Get project details API
export const GET = auth(async function GET(req: NextAuthRequest) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  try {
    // Get project details
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

// Update project API
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
      ltmRevenueUSD,
      disclosures,
    } = body

    // Validate required fields
    if (!name || !collectionAddress || !chainId || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Confirm the project owner
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

    // Update the project
    const [project] = await db
      .update(nftProjects)
      .set({
        name,
        image,
        collectionAddress,
        chainId,
        description,
        category,
        ltmRevenueUSD: ltmRevenueUSD || null,
      })
      .where(eq(nftProjects.id, id))
      .returning()

    // Delete existing disclosures
    await db
      .delete(projectDisclosures)
      .where(eq(projectDisclosures.projectId, id))

    // Create new disclosures (if any)
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

// Delete project API
export const DELETE = auth(async function DELETE(req: NextAuthRequest) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.pathname.split("/").pop()
  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  try {
    // Confirm the project owner
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
