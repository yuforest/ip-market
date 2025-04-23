import { relations } from "drizzle-orm"
import { doublePrecision, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { ProjectStatus } from "./enums"

// ユーザーテーブル
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  sub: text("sub").notNull().unique(), // Dynamic IDを保存
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ウォレットテーブル
export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull(),
  chain: text("chain").notNull(),
  dynamicId: text("dynamic_id").notNull().unique(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// NFTプロジェクトテーブル
export const nftProjects = pgTable("nft_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  collectionAddress: text("collection_address").notNull(),
  chainId: text("chain_id").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["Art", "PFP", "Game", "Music", "Utility"] }).notNull(),
  royaltyPct: doublePrecision("royalty_pct"), // プロジェクトのスマートコントラクトに設定されているロイヤリティ率
  ltmRevenueUSD: doublePrecision("ltm_revenue_usd"), // 直近12か月の収益総額（USD換算）
  ownerId: uuid("owner_id").references(() => users.id),
  metadataCID: text("metadata_cid"), // IPFS/ArweaveのCID
  status: text("status", { enum: ["draft", "active", "sold", "deleted"] }).notNull().default(ProjectStatus.DRAFT),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 出品リストテーブル
export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => nftProjects.id, { onDelete: "cascade" })
    .notNull(),
  priceUSDC: doublePrecision("price_usdc").notNull(),
  escrowAddress: text("escrow_address"),
  listedAt: timestamp("listed_at").defaultNow().notNull(),
})

// 取引テーブル
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id")
    .references(() => listings.id, { onDelete: "cascade" })
    .notNull(),
  buyerWalletId: uuid("buyer_wallet_id")
    .references(() => wallets.id)
    .notNull(),
  priceUSDC: doublePrecision("price_usdc").notNull(),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
  txHash: text("tx_hash").notNull(),
})

// 価値評価レポートテーブル
export const valuationReports = pgTable("valuation_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => nftProjects.id, { onDelete: "cascade" })
    .notNull(),
  estimatedValueUSD: doublePrecision("estimated_value_usd").notNull(),
  agentId: text("agent_id").notNull(), // AIエージェントの識別子
  modelVersion: text("model_version").notNull(), // 使用されたAIモデルのバージョン
  featuresJSON: text("features_json").notNull(), // 評価に使用された特徴量（JSON形式）
  commentaryText: text("commentary_text").notNull(), // AIによる評価コメント
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
})

// プロジェクト開示情報テーブル
export const projectDisclosures = pgTable("project_disclosures", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => nftProjects.id, { onDelete: "cascade" })
    .notNull(),
  disclosureType: text("disclosure_type").notNull(), // enum: financial, license, team, tokenomics, ...
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// リレーション定義
export const usersRelations = relations(users, ({ many, one }) => ({
  wallets: many(wallets),
  nftProjects: many(nftProjects),
}))

export const walletsRelations = relations(wallets, ({ many, one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  buyerTransactions: many(transactions, { relationName: "buyerWallet" }),
}))

export const nftProjectsRelations = relations(nftProjects, ({ many, one }) => ({
  owner: one(users, {
    fields: [nftProjects.ownerId],
    references: [users.id],
  }),
  listings: many(listings),
  valuationReports: many(valuationReports),
  disclosures: many(projectDisclosures),
}))

export const listingsRelations = relations(listings, ({ many, one }) => ({
  project: one(nftProjects, {
    fields: [listings.projectId],
    references: [nftProjects.id],
  }),
  transaction: one(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  listing: one(listings, {
    fields: [transactions.listingId],
    references: [listings.id],
  }),
  buyerWallet: one(wallets, {
    fields: [transactions.buyerWalletId],
    references: [wallets.id],
    relationName: "buyerWallet",
  }),
}))

export const valuationReportsRelations = relations(valuationReports, ({ one }) => ({
  project: one(nftProjects, {
    fields: [valuationReports.projectId],
    references: [nftProjects.id],
  }),
}))

export const projectDisclosuresRelations = relations(projectDisclosures, ({ one }) => ({
  project: one(nftProjects, {
    fields: [projectDisclosures.projectId],
    references: [nftProjects.id],
  }),
}))


export type User = typeof users.$inferSelect;
export type NftProject = typeof nftProjects.$inferSelect;
export type Listing = typeof listings.$inferSelect;
