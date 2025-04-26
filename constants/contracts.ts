/**
 * スマートコントラクトのアドレス
 * 環境によって異なる値を設定
 */

// コントラクトアドレスの型定義
export type ContractAddress = `0x${string}`;

// ローカル開発環境用
const LOCAL_ESCROW_CONTRACT_ADDRESS = "0xf4b21743f8c8839a4a533a9cfe36e98d922526ee";
const LOCAL_NFT_CONTRACT_ADDRESS = '0xe45b1ba5e3a64fd1dad1822b89985a0d19fc721d';

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
