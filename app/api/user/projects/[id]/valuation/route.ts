import { auth } from "@/auth"
import { db } from "@/lib/db"
import { nftProjects, valuationReports } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
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

    // Using OpenAI to generate a valuation report
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
Last 12 Months Revenue: ${project.ltmRevenueUSD || "N/A"}
Disclosures: ${project.disclosures.map(disclosure => `${disclosure.disclosureType}: ${disclosure.title}`).join("\n") || "N/A"}

Please provide:
Please prepare a detailed report evaluating the investment value of the following NFT projects.
Please summarize the entire report in 3,000-4,000 words in English and output in Markdown format.
Please include the following items

1. Project Summary.
   - Objective/vision, major NFT collections, chains, number of issues  
2. Market Environment/Competitive Analysis  
   - Comparison with 2-3 similar projects (size, use cases, market valuation)  
3. Demand-side indicators  
   - On-chain data including primary/secondary distribution volume, number of holders, resale rate, average holding period, etc.  
4. Supply-side indicators  
   - Total supply, release schedule, burn/staking availability  
5. Team and community analysis  
   - Core member biographies, community size (Discord / X followers), engagement metrics  
6. Talknomics & Cash Flow  
   - Loyalty rates, operating revenue sources, use of funds, treasury balance  
7. Development Progress & Roadmap  
   - Past milestones achieved and planned for the next 6-12 months  
8. Risk Factors.  
   - Regulations, market volatility, dependent platforms, smart contract vulnerabilities  
9. Valuation Methodology and Estimates (1) DCF (Discounted Cash Flow)  
   - (i) DCF (discounted future royalties), (ii) Relative value (similar collection multiples), (iii) On-chain indicators (e.g., NVT)  
   - Assumptions for each method, sensitivity analysis, and valuation by range  
10. final valuation at USDC

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
