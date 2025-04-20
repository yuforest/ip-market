"use server"

// 価値評価レポート関連のサーバーアクション

// プロジェクトの最新価値評価レポートを取得
export async function getLatestValuationReport(projectId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/valuation-reports?projectId=${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to get valuation report: ${response.statusText}`)
  }

  return response.json()
}

// 価値評価レポートを作成
export async function createValuationReport(reportData: {
  projectId: string
  estimatedValueUSD: number
  agentId: string
  modelVersion: string
  featuresJSON: string
  commentaryText: string
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/valuation-reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create valuation report: ${response.statusText}`)
  }

  return response.json()
}
