"use server"

// プロジェクト関連のサーバーアクション

// プロジェクト一覧を取得
export async function getProjects(params: {
  search?: string
  category?: string
  ownerId?: string
  limit?: number
  offset?: number
}) {
  const queryParams = new URLSearchParams()

  if (params.search) queryParams.set("search", params.search)
  if (params.category) queryParams.set("category", params.category)
  if (params.ownerId) queryParams.set("ownerId", params.ownerId)
  if (params.limit) queryParams.set("limit", params.limit.toString())
  if (params.offset) queryParams.set("offset", params.offset.toString())

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get projects: ${response.statusText}`)
  }

  return response.json()
}

// プロジェクト詳細を取得
export async function getProject(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get project: ${response.statusText}`)
  }

  return response.json()
}

// プロジェクトを作成
export async function createProject(projectData: {
  name: string
  collectionAddress: string
  chainId: string
  description: string
  category: string
  royaltyPct?: number
  ownerId: string
  metadataCID?: string
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.statusText}`)
  }

  return response.json()
}

// プロジェクトを更新
export async function updateProject(
  id: string,
  projectData: {
    name?: string
    description?: string
    category?: string
    royaltyPct?: number
    ltmRevenueUSD?: number
    metadataCID?: string
  },
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.statusText}`)
  }

  return response.json()
}
