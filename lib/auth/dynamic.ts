import type React from "react"
/*
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector"

// Dynamic認証プロバイダーコンポーネント
export function DynamicAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors],
        // ウォレット接続のみに制限する設定
        walletConnectorsForSecondaryMethods: [],
        evmNetworks: [
          {
            chainId: 1,
            name: "Ethereum",
            displayName: "Ethereum",
          },
          {
            chainId: 137,
            name: "Polygon",
            displayName: "Polygon",
          },
          {
            chainId: 10,
            name: "Optimism",
            displayName: "Optimism",
          },
          {
            chainId: 42161,
            name: "Arbitrum",
            displayName: "Arbitrum",
          },
        ],
        // メールログインを無効化
        emailAuth: {
          enabled: false,
        },
        // ソーシャルログインを無効化
        socialAuth: {
          enabled: false,
        },
      }}
    >
      <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
    </DynamicContextProvider>
  )
}
*/

// 代替のプロバイダーコンポーネント
export function DynamicAuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
