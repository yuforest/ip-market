"use server"

import { OpenAI } from "openai"

// OpenAIクライアントを初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// NFTプロジェクトの市場分析を生成
export async function generateMarketAnalysis(projectData: any): Promise<{
  marketTrends: string
  competitorAnalysis: string
  growthOpportunities: string
  risks: string
}> {
  try {
    // OpenAIを使用して市場分析を生成
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI specialized in NFT market analysis. Analyze the provided project data and generate a comprehensive market analysis report.",
        },
        {
          role: "user",
          content: JSON.stringify(projectData),
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    // レスポンスをパース
    const content = response.choices[0].message.content

    try {
      // JSONレスポンスの場合
      const data = JSON.parse(content || "{}")
      return {
        marketTrends: data.marketTrends || "",
        competitorAnalysis: data.competitorAnalysis || "",
        growthOpportunities: data.growthOpportunities || "",
        risks: data.risks || "",
      }
    } catch (error) {
      // テキストレスポンスの場合、セクションごとに分割
      const sections = content?.split(/#{2,3}\s+/g) || []

      return {
        marketTrends:
          sections
            .find((s) => s.toLowerCase().includes("market trends"))
            ?.replace(/market trends/i, "")
            .trim() || "",
        competitorAnalysis:
          sections
            .find((s) => s.toLowerCase().includes("competitor"))
            ?.replace(/competitor analysis/i, "")
            .trim() || "",
        growthOpportunities:
          sections
            .find((s) => s.toLowerCase().includes("growth"))
            ?.replace(/growth opportunities/i, "")
            .trim() || "",
        risks:
          sections
            .find((s) => s.toLowerCase().includes("risks"))
            ?.replace(/risks/i, "")
            .trim() || "",
      }
    }
  } catch (error) {
    console.error("Failed to generate market analysis:", error)
    throw error
  }
}
