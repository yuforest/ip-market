"use server"

// プロジェクト開示情報関連のサーバーアクション

// プロジェクト開示情報一覧を取得
export async function getProjectDisclosures(params: {
  projectId: string
  disclosureType?: string
}) {
  const queryParams = new URLSearchParams()

  queryParams.set("projectId", params.projectId)
  if (params.disclosureType) queryParams.set("disclosureType", params.disclosureType)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project-disclosures?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get project disclosures: ${response.statusText}`)
  }

  return response.json()
}

// プロジェクト開示情報を作成
export async function createProjectDisclosure(disclosureData: {
  projectId: string
  disclosureType: string
  title: string
  description: string
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/project-disclosures`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(disclosureData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create project disclosure: ${response.statusText}`)
  }

  return response.json()
}
