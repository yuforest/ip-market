"use server"

import { eq } from "drizzle-orm"
import { OpenAI } from "openai"
import { db } from "../db"
import { nftProjects } from "../db/schema"

// OpenAIクライアントを初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// NFTプロジェクトの価値評価を生成
export async function generateProjectValuation(projectId: string): Promise<{
  estimatedValueUSD: number
  featuresJSON: string
  commentaryText: string
}> {
  try {
    // プロジェクト情報を取得
    const project = await db.query.nftProjects.findFirst({
      where: eq(nftProjects.id, projectId),
      with: {
        disclosures: true,
      },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    // プロジェクトの特徴量を抽出
    const features = extractProjectFeatures(project)

    // OpenAIを使用して価値評価を生成
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI specialized in NFT project valuation. Analyze the provided project data and generate a comprehensive valuation report with estimated value in USD.",
        },
        {
          role: "user",
          content: JSON.stringify({
            project: {
              name: project.name,
              description: project.description,
              category: project.category,
              royaltyPct: project.royaltyPct,
              ltmRevenueUSD: project.ltmRevenueUSD,
              disclosures: project.disclosures,
            },
            features,
          }),
        },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    })

    // レスポンスをパース
    const content = response.choices[0].message.content
    const valuationData = parseValuationResponse(content)

    return {
      estimatedValueUSD: valuationData.estimatedValueUSD,
      featuresJSON: JSON.stringify(features),
      commentaryText: valuationData.commentary,
    }
  } catch (error) {
    console.error("Failed to generate project valuation:", error)
    throw error
  }
}

// プロジェクトの特徴量を抽出
function extractProjectFeatures(project: any) {
  // 実際の実装では、以下のような特徴量を抽出する
  return {
    name: project.name,
    category: project.category,
    royaltyPct: project.royaltyPct || 0,
    ltmRevenueUSD: project.ltmRevenueUSD || 0,
    disclosureCount: project.disclosures?.length || 0,
    hasFinancialDisclosure: project.disclosures?.some((d: any) => d.disclosureType === "financial") || false,
    hasTeamDisclosure: project.disclosures?.some((d: any) => d.disclosureType === "team") || false,
    hasLicenseDisclosure: project.disclosures?.some((d: any) => d.disclosureType === "license") || false,
    // 外部APIから取得する追加データ
    // marketStats: await fetchMarketStats(project.collectionAddress, project.chainId),
  }
}

// AIレスポンスをパース
function parseValuationResponse(content: string | null): {
  estimatedValueUSD: number
  commentary: string
} {
  if (!content) {
    return {
      estimatedValueUSD: 0,
      commentary: "Failed to generate valuation",
    }
  }

  try {
    // JSONレスポンスの場合
    const data = JSON.parse(content)
    return {
      estimatedValueUSD: data.estimatedValueUSD || 0,
      commentary: data.commentary || "",
    }
  } catch (error) {
    // テキストレスポンスの場合、正規表現で価値を抽出
    const valueMatch = content.match(/estimated value.*?(\d+[,\d]*(\.\d+)?)/i)
    const estimatedValueUSD = valueMatch ? Number.parseFloat(valueMatch[1].replace(/,/g, "")) : 0

    return {
      estimatedValueUSD,
      commentary: content,
    }
  }
}
