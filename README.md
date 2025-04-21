# 1. 概要

## 1.1 NFT IP マーケットとは？

既に発行・流通している **NFT コレクション（＝デジタル IP）そのものを、安全かつワンストップで売買できる取引所** です。

"トークン単体" ではなく「**IP ＋コミュニティ＋スマートコントラクト管理権限**」をまとめて譲渡できる点が最大の特徴です。

---

## 1.2 ステークホルダー別の価値提案

### 1.2.1 売り手（クリエイター／運営会社）にとっての課題と価値

| 課題                            | NFT IP マーケットが提供する解決策                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Exit 不在**・M&A の窓口がない | - ウォレット署名だけで**IP を丸ごと売却**- AI が即時バリュエーション → 適正価格で出品- 売却代金は**USDC で即時受領** |
| **交渉の手間**                  | - 買い手候補をプラットフォームが自動マッチング                                                                       |

---

### 1.2.2 買い手（VC／ゲーム・アニメ・メディア企業）にとっての課題と価値

| 課題                         | NFT IP マーケットが提供する解決策                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| **新規 IP 開発コストが高い** | - 既にファンを抱える IP を**一括取得**- コミュニティ・SNS・NFT 保有者をそのまま活用 |
| **権利関係の不透明さ**       | - ブロックチェーン上で owner 権限を移転 →**法的クリア**                             |
| **相場情報不足**             | - AI レポートで過去取引量・ロイヤルティ実績を可視化                                 |
| **キャッシュフローの即時性** | - USDC 決済 → 仕入れから利用までのタイムラグ最小                                    |

---

### 1.2.3 投資家・コミュニティ（保有ホルダー）にとっての課題と価値

| 期待                     | マーケットの効果                                                           |
| ------------------------ | -------------------------------------------------------------------------- |
| **プロジェクトの持続性** | - 事業者の運営が難しくなっても 引き継ぎにより IP 活性 → NFT の二次価値向上 |
| **透明な運営**           | - 取引履歴・レポートが公開され**ガバナンスが強化**                         |
| **流動性**               | - IP 毎の売買市場ができ、**EXIT ＝価値向上の機会**が明確に                 |

---

## 1.3 プラットフォームの価値創出

- **3 % の取引手数料** + 将来的なプレミアム機能課金
- AI 解析データを二次活用した **エコシステム SaaS** への展開
- 日本発の **IP 特化型デジタル M&A ハブ** としてポジショニング

---

## 1.4 市場機会

1. **NFT 市場の成熟**
   - 初期ブーム後、継続した運用に悩むプロジェクトが増加。
2. **Web3 × 既存コンテンツ産業の融合**
   - 大手ゲーム・アニメ企業が Web3 を模索するも、ゼロイチは高リスク。
3. **規制環境の明確化**
   - 日本でも「電子記録移転権利」への法整備が進み、デジタル IP 取引が合法的に。

---

## 1.5 まとめ

| ステークホルダー     | 一言で伝える価値                                                                     |
| -------------------- | ------------------------------------------------------------------------------------ |
| **売り手**           | 「プロジェクトを閉じる前に、"ファンごと" 欲しい企業へ高値で引き渡せます。」          |
| **買い手**           | 「ゼロからコミュニティを育てずに、即戦力 IP と熱量あるファンを獲得できます。」       |
| **ホルダー／投資家** | 「オーナー交代で IP が再生し、NFT の可能性を広げる"セカンドチャンス"が得られます。」 |

NFT IP マーケットは、**全ステークホルダーに"ウィン"をもたらす** 新しい流動性インフラです。

## 2. ビジネス要件

| 項目                   | 決定内容                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **サービス目的**       | ①NFT IP 運営者が “出口戦略” として M&A を選択できる市場を創出 ② 買い手は既存ファンベース付き IP を取得して新規事業に活用                      |
| **現状の課題**         | - NFT プロジェクトは流動性が低く Exit が困難- 企業側は “ゼロ →IP 構築” のリスクが高い                                                         |
| **主要 KPI**           | - 年間流通総額 (GMV) 10  億円- 取引手数料収入 3 % →  初年度 3,000  万円- 上場件数  ≥ 50  コレクション                                         |
| **対象地域**           | 世界                                                                                                                                          |
| **収益モデル**         | 各取引額の **3 %** を徴収 (USDC 建て)                                                                                                         |
| **決済通貨**           | **USDC** (Soneium チェーン)                                                                                                                   |
| **ガバナンストークン** | なし                                                                                                                                          |
| **ステークホルダー**   | 売り手  =  個人クリエイター／運営会社／法人買い手  = VC、ゲーム・メディア・アニメ・漫画・ラノベ企業モデレーター DAO =  不要（運営が中央管理） |

```mermaid
graph TD
  %% --- 売り手サイド ---
  subgraph sellerSide["売り手サイド"]
    Seller["売り手<br/>(NFT運営者・クリエイター)"]
  end

  %% --- プラットフォーム ---
  subgraph platformSide["プラットフォーム"]
    Platform["マーケットプレイス<br/>(運営者)"]
    Escrow["EscrowSwap<br/>スマートコントラクト"]
  end

  %% --- 買い手サイド ---
  subgraph buyerSide["買い手サイド"]
    Buyer["買い手<br/>(VC・企業など)"]
  end

  %% --- ブロックチェーン ---
  subgraph chainSide["Soneium"]
    NFTCollection["NFT Collection"]
  end

  %% フロー
  Seller   -->|NFT Collection登録|Platform
  Seller   -->|所有|NFTCollection
  Platform -->|AI 査定 & NFT Collection 公開|Seller
  Buyer    -->|NFT Collection 参照／検索|Platform
  Buyer    -->|購入 Tx|Escrow
  Escrow   -->|USDC 送金|Seller
  Escrow   -->|Collection Own 移転|Buyer
  Escrow   -->|操作|NFTCollection
  Escrow -->|手数料 3% 徴収|Platform

  %% スタイル
  classDef light fill:#f6f9fc,stroke:#bcccdc,color:#1f2937;
  class Seller,Buyer,Platform,Escrow,NFTCollection light;

```

## 2. 機能

### **2-1. ユーザー管理機能**

- **ユーザー登録・認証**
  - ログイン機能
  - 新規ユーザー登録

### **2-2. マーケットプレイス機能**

- **知的財産の一覧表示**
  - プロジェクト検索・フィルタリング
- **プロジェクト詳細表示**
  - 個別プロジェクト情報の閲覧
  - AI 分析レポートの閲覧

### **2-3. 知的財産取引機能**

- **NFT IP 管理**
  - NFT IP の出品
- **取引処理**
  - 取引履歴の管理
  - エスクロースマートコントラクトによる安全な取引

---

## 3. シーケンス

```mermaid
sequenceDiagram
    autonumber
    %% ===== 登場人物 =====
    participant Seller   as 売り手ユーザー
    participant FE       as Frontend<br/>(Web App)
    participant DynAuth  as Dynamic<br/>Authサービス
    participant BE       as Backend<br/>(API)
    participant DB       as DB
    participant AIAgent  as AIエージェント<br/>(ElizaOS)
    participant CollCtr  as NFTCollectionContract
    participant EscrowContract  as EscrowContract

    %% === 1. Dynamic Social 認証 ===
    Seller ->> FE: ① 「Googleでログイン」クリック
    FE     ->> DynAuth: ② OAuth リクエスト
    DynAuth ->> Seller: ③ Google 認可画面
    Seller ->> DynAuth: ④ 認可許可
    DynAuth -->> FE: ⑤ authToken + walletAddr
    FE     ->> BE: ⑥ authToken 検証依頼
    BE     ->> DynAuth: ⑦ verify(authToken)
    DynAuth -->> BE: ⑧ OK
    BE -->> FE: ⑨ セッショントークン
    FE -->> Seller: ⑩ ログイン完了

    %% === 2. プロジェクト情報入力 ===
    Seller ->> FE: ⑪ 登録フォーム入力 (collectionAddr, 権利説明 等)
    FE     ->> BE: ⑫ 入力データ送信(JSON)

    %% === 3. オーナーシップ検証 ===
    BE     ->> CollCtr: ⑬ owner()
    CollCtr -->> BE: ⑭ ownerAddr
    alt ownerAddr ≠ walletAddr
        BE -->> FE: ⑮ エラー「owner 不一致」
        FE -->> Seller: ⑯ 登録失敗
     else
        BE ->> DB: ⑮ プロジェクトメタ仮登録(status="Pending")
        DB -->> BE: ⑯ OK
    end

    %% === 4. AI レポート生成 & DB 登録 ===
    BE ->> AIAgent: ⑰ 特徴量(JSON) + オンチェーン指標 送信
    AIAgent ->> AIAgent: ⑱ バリュエーション計算 & レポート作成
    AIAgent ->> DB: ⑲ レポート & 価格 保存 (reportId, valuation)
    DB      -->> AIAgent: ⑳ OK
    AIAgent -->> BE: ㉑ {valuation, reportId, topFeatures}

    %% === 5. 売価提示 → 確定 ===
    BE -->> FE: ㉒ 売価案(valuation) 提示
    FE -->> Seller: ㉓ UI表示
    Seller ->> FE: ㉔ 売価確認 / 修正
    FE ->> BE: ㉕ 最終売価送信

    %% === 6. 販売登録 (SaleContract) ===
    BE ->> EscrowContract: ㉖ registerSale(collectionAddr, price)
    EscrowContract -->> BE: ㉗ saleId
    BE ->> DB: ㉘ saleId / price / status="Open" 更新
    DB -->> BE: ㉙ OK
    BE -->> FE: ㉚ 「登録完了」レスポンス
    FE -->> Seller: ㉛ 完了通知

```

```mermaid
sequenceDiagram
    autonumber
    %% ===== 登場人物 =====
    participant Buyer      as 買い手ユーザー
    participant FE         as Frontend<br/>(Web App)
    participant DynAuth    as Dynamic<br/>Authサービス
    participant BE         as Backend<br/>(API)
    participant DB         as DB
    participant EscrowContract    as EscrowContract
    participant CollCtr    as NFTCollectionContract
    participant Seller     as 売り手ユーザー
    participant PlatWallet as プラットフォーム手数料アドレス

    %% === 1. Dynamic Social 認証 ===
    Buyer ->> FE: ① 「Googleでログイン」クリック
    FE   ->> DynAuth: ② OAuth リクエスト
    DynAuth ->> Buyer: ③ Google 認可画面
    Buyer ->> DynAuth: ④ 認可許可
    DynAuth -->> FE: ⑤ authToken + walletAddr
    FE   ->> BE: ⑥ authToken 検証依頼
    BE   ->> DynAuth: ⑦ verify(authToken)
    DynAuth -->> BE: ⑧ OK
    BE   -->> FE: ⑨ セッショントークン
    FE   -->> Buyer: ⑩ ログイン完了

    %% === 2. 販売中 IP 一覧取得 ===
    Buyer ->> FE: ⑪ IP 一覧閲覧
    FE   ->> DB: ⑫ status="Open" の sale 取得
    DB   -->> FE: ⑬ sale 一覧(JSON)
    FE   -->> Buyer: ⑭ 一覧表示

    %% === 3. 購入準備 ===
    Buyer ->> FE: ⑮ 対象 IP をクリック (saleId)
    FE   ->> DB: ⑯ sale 詳細取得
    DB   -->> FE: ⑰ price, collectionAddr, sellerAddr
    FE   -->> Buyer: ⑱ 詳細表示 & 「購入」ボタン

    %% === 4. 購入トランザクション ===
    FE   ->> EscrowContract: ⑲ buy(saleId) データ生成
    FE   -->> Buyer: ⑳ ウォレット署名要求
    Buyer ->> EscrowContract: ㉑ buy(saleId) + USDC 送信

    %% === 5. SaleContract 内処理 ===
    EscrowContract ->> DB: ㉒ status 検証 (="Open")
    DB      -->> EscrowContract: ㉓ OK
    EscrowContract ->> CollCtr: ㉔ transferOwnership(Seller → Buyer)
    CollCtr -->> EscrowContract: ㉕ OwnershipTransferred
    EscrowContract ->> Seller: ㉖ USDC 送金 (price × 97%)
    EscrowContract ->> PlatWallet: ㉗ 手数料 3% 送金
    EscrowContract ->> DB: ㉘ status="Sold" 更新
    DB      -->> EscrowContract: ㉙ OK
    EscrowContract -->> Buyer: ㉚ PurchaseSuccess イベント

    %% === 6. ポスト処理 & 通知 ===
    EscrowContract --> BE: ㉛ Webhook(txHash, saleId, BuyerAddr)
    BE      ->> DB: ㉜ 取引ログ保存
    BE      -->> FE: ㉝ 完了レスポンス
    FE      -->> Buyer: ㉞ UI & メール「購入完了」
    FE      -->> Seller: ㉟ UI & メール「売却完了」

```

---

## 4. スマートコントラクト設計

| Contract   | 主責務                                                             |
| ---------- | ------------------------------------------------------------------ |
| **Escrow** | NFT コレクション取引の総合管理（エスクロー、権限移転、手数料処理） |

---

## 5. DB 設計

[/drizzle/migrations](https://github.com/yuforest/ip-market/blob/ec2f490264e81ea475a09de07f1f8c79ddd0b0d0/drizzle/migrations)参照

## 6. 技術構成

一つのリポジトリに Next.js、ElizaOS が入る想定

- フロントエンド: Next.js
- バックエンド: Next.js
- AI: ElizaOS
- 認証: Dynamic
- ブロックチェーン: Soneium
- node: SCS
- ORM: drizzle
- DB: NeonDB(Postgres-as-a-Service)、https://neon.tech/

## 7. 今後の展望：安全性 & コンプライアンス

- **KYC/KYB**: 初回出品 & 50 k USDC 超の購入で必須 (eKYC API)
- **知財チェック**: 商標 PDF ハッシュを IPFS に格納、運営が手動承認
- **AML**: ライブチェーン解析 (Chainalysis API) でハイリスクウォレット拒否
- ドキュメントを入力可能にすることで利便化

---

==============================================================================================

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Drizzle commands

`db/schema.ts`を変更したあと、
`npm run db:generate`(マイグレーションファイルの生成), `npm run db:migrate`(マイグレーションの実行)をすることで DB にスキーマを反映できる。
`npm run db:studio`を使うことで GUI から、DB の操作が可能となる。
