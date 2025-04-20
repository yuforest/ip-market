"use server"

// ユーザー関連のサーバーアクション

// DIDでユーザーを取得
export async function getUserByDid(did: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user?did=${did}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to get user: ${response.statusText}`)
  }

  return response.json()
}

// ユーザーを作成
export async function createUser(userData: { did: string; walletAddress?: string; chainId?: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.statusText}`)
  }

  return response.json()
}
