import hre from "hardhat";

async function main() {
  console.log("デプロイを開始します...");

  // デプロイアカウントの取得
  const [deployer] = await hre.viem.getWalletClients();
  console.log("デプロイアカウント:", deployer.account.address);

  // USDC アドレスの設定
  const usdcAddress = "0xE9A198d38483aD727ABC8b0B1e16B2d338CF0391"; // minato のUSDC
  console.log("USDC アドレス:", usdcAddress);

  try {
    // DemoNFT のデプロイ
    console.log("DemoNFT コントラクトをデプロイ中...");
    
    // アーティファクトの読み込み
    const DemoNFTArtifact = await hre.artifacts.readArtifact("DemoNFT");
    
    // デプロイハッシュの取得
    const deployHash = await deployer.deployContract({
      abi: DemoNFTArtifact.abi,
      bytecode: DemoNFTArtifact.bytecode,
      args: [deployer.account.address]
    });
    
    // トランザクション待機
    const publicClient = await hre.viem.getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
    
    if (!receipt.contractAddress) {
      throw new Error("DemoNFTコントラクトのデプロイに失敗しました");
    }
    
    const demoNftAddress = receipt.contractAddress;
    console.log("DemoNFT デプロイ完了:", demoNftAddress);

    // Escrow のデプロイ
    console.log("Escrow コントラクトをデプロイ中...");
    
    // アーティファクトの読み込み
    const EscrowArtifact = await hre.artifacts.readArtifact("Escrow");
    
    // デプロイハッシュの取得
    const escrowDeployHash = await deployer.deployContract({
      abi: EscrowArtifact.abi,
      bytecode: EscrowArtifact.bytecode,
      args: [usdcAddress]
    });
    
    // トランザクション待機
    const escrowReceipt = await publicClient.waitForTransactionReceipt({ hash: escrowDeployHash });
    
    if (!escrowReceipt.contractAddress) {
      throw new Error("Escrowコントラクトのデプロイに失敗しました");
    }
    
    const escrowAddress = escrowReceipt.contractAddress;
    console.log("Escrow デプロイ完了:", escrowAddress);

    console.log("デプロイ処理が完了しました");
    console.log({
      DemoNFT: demoNftAddress,
      // Escrow: escrowAddress,
      USDC: usdcAddress,
    });
  } catch (error) {
    console.error("デプロイ中にエラーが発生しました:", error);
    throw error;
  }
}

// エラーハンドリングを追加
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("デプロイに失敗しました:", error);
    process.exit(1);
  });
