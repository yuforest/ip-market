"use server"

import { ethers } from "ethers"

// NFTコントラクトのABI（最小限）
const NFT_CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function royaltyInfo(uint256 _tokenId, uint256 _salePrice) view returns (address, uint256)",
]

// コントラクト所有者の検証
export async function verifyContractOwnership(
  contractAddress: string,
  chainId: string,
  walletAddress: string,
): Promise<{
  isOwner: boolean
  contractName?: string
  contractSymbol?: string
  totalSupply?: string
  royaltyPct?: number
}> {
  try {
    // RPC URLを取得
    const rpcUrl = getRpcUrlByChainId(chainId)
    if (!rpcUrl) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }

    // プロバイダーを作成
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    // コントラクトインスタンスを作成
    const contract = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, provider)

    // コントラクト所有者を取得
    const owner = await contract.owner()

    // 所有者の検証
    const isOwner = owner.toLowerCase() === walletAddress.toLowerCase()

    // コントラクト情報を取得
    const contractName = await contract.name()
    const contractSymbol = await contract.symbol()
    const totalSupply = (await contract.totalSupply()).toString()

    // ロイヤリティ情報を取得（tokenId=0, salePrice=10000で試行）
    let royaltyPct = 0
    try {
      const [, royaltyAmount] = await contract.royaltyInfo(0, 10000)
      royaltyPct = Number(royaltyAmount) / 100 // 10000の場合、パーセンテージに変換
    } catch (error) {
      console.warn("Failed to get royalty info:", error)
    }

    return {
      isOwner,
      contractName,
      contractSymbol,
      totalSupply,
      royaltyPct,
    }
  } catch (error) {
    console.error("Failed to verify contract ownership:", error)
    return { isOwner: false }
  }
}

// チェーンIDからRPC URLを取得
function getRpcUrlByChainId(chainId: string): string | null {
  const rpcUrls: Record<string, string> = {
    "1": process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
    "137": process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
    "10": process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
    "42161": process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
  }

  return rpcUrls[chainId] || null
}
