import { auth } from "@/auth"
import { db } from "@/lib/db"
import { nftProjects, valuationReports } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { getValuationPrompt } from "./prompt"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(
  req: NextRequest,
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId } = await req.json()
    const project = await db.query.nftProjects.findFirst({
      where: eq(nftProjects.id, projectId),
      with: {
        disclosures: true
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const modelVersion = "gpt-4o"

    // Using OpenAI to generate a valuation report
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert in NFT valuation. Analyze the following NFT project and provide a detailed valuation report.",
        },
        {
          role: "user",
          content: getValuationPrompt(project),
        },
      ],
      model: modelVersion,
    })

    const data = JSON.parse(completion.choices[0].message.content || "{}")
    const report = data.report
    const estimatedValueUSD = data.estimatedValueUSD
    if (!report || !estimatedValueUSD) {
      return NextResponse.json({ error: "Invalid response from OpenAI" }, { status: 500 })
    }

    const existingReport = await db.query.valuationReports.findFirst({
      where: eq(valuationReports.projectId, projectId),
    })
    if (existingReport) {
      await db.update(valuationReports).set({
        report,
        estimatedValueUSD,
        modelVersion,
        updatedAt: new Date(),
      }).where(eq(valuationReports.id, existingReport.id))
    } else {
      // Save the valuation report to the database
      await db
        .insert(valuationReports)
      .values({
        projectId,
        report,
        estimatedValueUSD,
        modelVersion,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    }

    return NextResponse.json(
      {
        report,
        estimatedValueUSD,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Failed to generate valuation report:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
