"use server"

// 出品関連のサーバーアクション

// 出品一覧を取得
export async function getListings(params: {
  projectId?: string
  sellerWalletId?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const queryParams = new URLSearchParams()

  if (params.projectId) queryParams.set("projectId", params.projectId)
  if (params.sellerWalletId) queryParams.set("sellerWalletId", params.sellerWalletId)
  if (params.status) queryParams.set("status", params.status)
  if (params.limit) queryParams.set("limit", params.limit.toString())
  if (params.offset) queryParams.set("offset", params.offset.toString())

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get listings: ${response.statusText}`)
  }

  return response.json()
}

// 出品詳細を取得
export async function getListing(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get listing: ${response.statusText}`)
  }

  return response.json()
}

// 出品を作成
export async function createListing(listingData: {
  projectId: string
  sellerWalletId: string
  priceUSDC: number
  escrowAddress?: string
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listingData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create listing: ${response.statusText}`)
  }

  return response.json()
}

// 出品を更新
export async function updateListing(
  id: string,
  listingData: {
    status?: string
    priceUSDC?: number
    escrowAddress?: string
  },
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listingData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update listing: ${response.statusText}`)
  }

  return response.json()
}

// 出品を削除（取り下げ）
export async function deleteListing(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete listing: ${response.statusText}`)
  }

  return response.json()
}
