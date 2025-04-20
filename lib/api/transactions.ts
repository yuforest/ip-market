"use server"

// 取引関連のサーバーアクション

// 取引一覧を取得
export async function getTransactions(params: {
  buyerWalletId?: string
  listingId?: string
  limit?: number
  offset?: number
}) {
  const queryParams = new URLSearchParams()

  if (params.buyerWalletId) queryParams.set("buyerWalletId", params.buyerWalletId)
  if (params.listingId) queryParams.set("listingId", params.listingId)
  if (params.limit) queryParams.set("limit", params.limit.toString())
  if (params.offset) queryParams.set("offset", params.offset.toString())

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get transactions: ${response.statusText}`)
  }

  return response.json()
}

// 取引を作成（購入処理）
export async function createTransaction(transactionData: {
  listingId: string
  buyerWalletId: string
  priceUSDC: number
  txHash: string
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create transaction: ${response.statusText}`)
  }

  return response.json()
}
