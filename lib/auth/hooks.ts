"use client"

// import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { useEffect, useState } from "react"

// カスタムフック: 認証状態とユーザー情報を管理
export function useAuth() {
  // Dynamic SDKのコードをコメントアウト
  // const { user: dynamicUser, isAuthenticated, primaryWallet } = useDynamicContext()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 仮の認証状態チェック
  useEffect(() => {
    // ローカルストレージなどからユーザー情報を取得する実装に置き換え可能
    const checkAuth = async () => {
      setLoading(true)
      try {
        // 実際の実装では、ここでトークンの検証などを行う
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("認証チェックエラー:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // 仮のログイン関数
  const login = async (walletAddress: string, chainId: string) => {
    setLoading(true)
    try {
      // 実際の実装では、ここでウォレット認証を行う
      // ユーザータイプを使用しない
      const mockUser = {
        id: "mock-user-id",
        did: `did:ethr:${walletAddress}`,
        wallets: [{ address: walletAddress, chainId }],
        // userType プロパティを削除
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return mockUser
    } catch (error) {
      console.error("ログインエラー:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 仮のログアウト関数
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return {
    user,
    isAuthenticated,
    loading,
    wallet: null, // 実際の実装ではウォレット情報を返す
    login,
    logout,
  }
}
