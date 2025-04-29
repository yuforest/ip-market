import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { nftProjects, valuationReports } from "@/lib/db/schema"
import OpenAI from "openai"

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

    // ChatGPTにプロジェクトの価値を算出させる
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert in NFT valuation. Analyze the following NFT project and provide a detailed valuation report.",
        },
        {
          role: "user",
          content: `Please analyze this NFT project and provide a valuation:
Name: ${project.name}
Collection Address: ${project.collectionAddress}
Description: ${project.description}
Category: ${project.category}
Chain: ${project.chainId}
Royalty Percentage: ${project.royaltyPct}%
Last 12 Months Revenue: ${project.ltmRevenueUSD || "N/A"}
Disclosures: ${project.disclosures.map(disclosure => `${disclosure.disclosureType}: ${disclosure.title}`).join("\n") || "N/A"}

Please provide:
1. Market Analysis
2. Revenue Potential
3. Risk Assessment
4. Final Valuation in USDC

The response should be a JSON object like below.
Not include any other text or formatting like \`\`\`json or \`\`\`


{
  "estimatedValueUSD": 1000000,
  "report": "This NFT project is worth 1 million USDC."
}
`,
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
    console.log(report)
    console.log(estimatedValueUSD)

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