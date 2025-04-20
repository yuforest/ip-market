"use server"

import { ethers } from "ethers"

// エスクローコントラクトのABI
const ESCROW_CONTRACT_ABI = [
  "function createEscrow(address _nftContract, address _seller, address _buyer, uint256 _price) external returns (address)",
  "function releaseEscrow(address _escrowAddress) external",
  "function cancelEscrow(address _escrowAddress) external",
]

// エスクローコントラクトのアドレス（チェーンごと）
const ESCROW_CONTRACT_ADDRESSES: Record<string, string> = {
  "1": process.env.ETHEREUM_ESCROW_CONTRACT || "",
  "137": process.env.POLYGON_ESCROW_CONTRACT || "",
  "10": process.env.OPTIMISM_ESCROW_CONTRACT || "",
  "42161": process.env.ARBITRUM_ESCROW_CONTRACT || "",
}

// エスクローを作成
export async function createEscrow(
  chainId: string,
  nftContractAddress: string,
  sellerAddress: string,
  buyerAddress: string,
  priceUSDC: number,
): Promise<string> {
  try {
    // エスクローコントラクトアドレスを取得
    const escrowContractAddress = ESCROW_CONTRACT_ADDRESSES[chainId]
    if (!escrowContractAddress) {
      throw new Error(`Escrow contract not available for chain ID: ${chainId}`)
    }

    // RPC URLを取得
    const rpcUrl = getRpcUrlByChainId(chainId)
    if (!rpcUrl) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }

    // プライベートキーを取得
    const privateKey = process.env.ESCROW_PRIVATE_KEY
    if (!privateKey) {
      throw new Error("Escrow private key not configured")
    }

    // プロバイダーとウォレットを作成
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(privateKey, provider)

    // エスクローコントラクトインスタンスを作成
    const escrowContract = new ethers.Contract(escrowContractAddress, ESCROW_CONTRACT_ABI, wallet)

    // エスクローを作成
    const tx = await escrowContract.createEscrow(
      nftContractAddress,
      sellerAddress,
      buyerAddress,
      ethers.parseUnits(priceUSDC.toString(), 6), // USDCは6桁の精度
    )

    // トランザクションの完了を待機
    const receipt = await tx.wait()

    // イベントからエスクローアドレスを取得
    const escrowAddress = receipt.logs[0].address // 仮の実装、実際にはイベントをパースする必要がある

    return escrowAddress
  } catch (error) {
    console.error("Failed to create escrow:", error)
    throw error
  }
}

// エスクローを解放（取引完了）
export async function releaseEscrow(chainId: string, escrowAddress: string): Promise<string> {
  try {
    // エスクローコントラクトアドレスを取得
    const escrowContractAddress = ESCROW_CONTRACT_ADDRESSES[chainId]
    if (!escrowContractAddress) {
      throw new Error(`Escrow contract not available for chain ID: ${chainId}`)
    }

    // RPC URLを取得
    const rpcUrl = getRpcUrlByChainId(chainId)
    if (!rpcUrl) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }

    // プライベートキーを取得
    const privateKey = process.env.ESCROW_PRIVATE_KEY
    if (!privateKey) {
      throw new Error("Escrow private key not configured")
    }

    // プロバイダーとウォレットを作成
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(privateKey, provider)

    // エスクローコントラクトインスタンスを作成
    const escrowContract = new ethers.Contract(escrowContractAddress, ESCROW_CONTRACT_ABI, wallet)

    // エスクローを解放
    const tx = await escrowContract.releaseEscrow(escrowAddress)

    // トランザクションの完了を待機
    const receipt = await tx.wait()

    return receipt.hash
  } catch (error) {
    console.error("Failed to release escrow:", error)
    throw error
  }
}

// エスクローをキャンセル
export async function cancelEscrow(chainId: string, escrowAddress: string): Promise<string> {
  try {
    // エスクローコントラクトアドレスを取得
    const escrowContractAddress = ESCROW_CONTRACT_ADDRESSES[chainId]
    if (!escrowContractAddress) {
      throw new Error(`Escrow contract not available for chain ID: ${chainId}`)
    }

    // RPC URLを取得
    const rpcUrl = getRpcUrlByChainId(chainId)
    if (!rpcUrl) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }

    // プライベートキーを取得
    const privateKey = process.env.ESCROW_PRIVATE_KEY
    if (!privateKey) {
      throw new Error("Escrow private key not configured")
    }

    // プロバイダーとウォレットを作成
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(privateKey, provider)

    // エスクローコントラクトインスタンスを作成
    const escrowContract = new ethers.Contract(escrowContractAddress, ESCROW_CONTRACT_ABI, wallet)

    // エスクローをキャンセル
    const tx = await escrowContract.cancelEscrow(escrowAddress)

    // トランザクションの完了を待機
    const receipt = await tx.wait()

    return receipt.hash
  } catch (error) {
    console.error("Failed to cancel escrow:", error)
    throw error
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
