import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ProjectStatus } from "@/lib/db/enums"
import { nftProjects, projectDisclosures } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import type { NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"

// Get project list API
export const GET = auth(async function GET(req: NextAuthRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Build query conditions
    const conditions = [
      ne(nftProjects.status, ProjectStatus.DELETED),
      eq(nftProjects.ownerId, session?.user?.id),
    ]

    // Get project list
    const projects = await db.query.nftProjects.findMany({
      where: and(...conditions),
      with: {
        owner: true,
        valuationReports: {
          orderBy: (reports, { desc }) => [desc(reports.createdAt)],
          limit: 1,
        },
        listing: true,
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })

    return NextResponse.json({ projects })
  } catch (error: unknown) {
    console.error("Failed to get projects:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
})

// Create project API
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
      disclosures,
      image,
    } = body

    // Validate required fields
    if (!name || !collectionAddress || !chainId || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create project
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
        image: image || null,
        ownerId: req.auth.user.id,
        status: ProjectStatus.DRAFT,
      })
      .returning()

    // Create disclosures (if any)  
    if (disclosures && disclosures.length > 0) {
      interface Disclosure {
        disclosureType: string
        title: string
        description: string
      }
      
      const disclosureValues = disclosures.map((disclosure: Disclosure) => ({
        projectId: project.id,
        disclosureType: disclosure.disclosureType,
        title: disclosure.title,
        description: disclosure.description,
      }))

      await db.insert(projectDisclosures).values(disclosureValues)
    }

    return NextResponse.json(project)
  } catch (error: unknown) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
})
