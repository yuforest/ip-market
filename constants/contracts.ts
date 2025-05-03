/**
 * スマートコントラクトのアドレス
 * 環境によって異なる値を設定
 */

// コントラクトアドレスの型定義
export type ContractAddress = `0x${string}`;

// ローカル開発環境用
const LOCAL_ESCROW_CONTRACT_ADDRESS = "0x11afd4965ddf91d42d9567970efb5c30687b051b";
const LOCAL_NFT_CONTRACT_ADDRESS = '0xf3d9a5c8f5f7629b0f92152100ef517af91d4978';

// テストネット用（Sepolia）
const TESTNET_ESCROW_CONTRACT_ADDRESS = "0x000000000000000000000000000000000000dEaD";

// 本番環境用
const MAINNET_ESCROW_CONTRACT_ADDRESS = "0x000000000000000000000000000000000000dEaD";

// 環境に応じたアドレスを選択（環境変数から取得）
const getEnvironment = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT || "local";
};

// 適切な環境のアドレスを返す関数
const getEscrowContractAddress = (): string => {
  const environment = getEnvironment();
  
  switch (environment) {
    case "local":
      return LOCAL_ESCROW_CONTRACT_ADDRESS;
    case "testnet":
      return TESTNET_ESCROW_CONTRACT_ADDRESS;
    case "mainnet":
      return MAINNET_ESCROW_CONTRACT_ADDRESS;
    default:
      return LOCAL_ESCROW_CONTRACT_ADDRESS;
  }
};

// エクスポートするコントラクトアドレス
export const escrowContractAddress: ContractAddress = getEscrowContractAddress() as ContractAddress;
