import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, numeric, pgEnum } from "drizzle-orm/pg-core"

// Enums
export const projectCategoryEnum = pgEnum('project_category', [
  'Art',
  'PFP',
  'Game',
  'Music',
  'Utility',
]);

export const disclosureTypeEnum = pgEnum('disclosure_type', [
  'financial',
  'license',
  'team',
  'tokenomics',
]);

export const listingStatusEnum = pgEnum('listing_status', [
  'draft',
  'active',
  'processing',
  'sold',
  'cancelled',
]);

// ユーザーテーブル
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  dynamicUserId: text('dynamic_user_id').notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// NFTプロジェクトテーブル
export const nftProjects = pgTable("nft_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  collectionAddress: text("collection_address").notNull(),
  chainId: text("chain_id").notNull(),
  description: text("description"),
  category: projectCategoryEnum('category').notNull(),
  royaltyPct: numeric('royalty_pct').notNull().default('0'),
  ltmRevenueUsd: numeric('ltm_revenue_usd').notNull().default('0'),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 出品リストテーブル
export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  nftProjectId: uuid('nft_project_id').notNull().references(() => nftProjects.id),
  sellerWalletAddress: text('seller_wallet_address').notNull(),
  status: listingStatusEnum('status').notNull(),
  priceUsdc: numeric('price_usdc').notNull(),
  escrowAddress: text('escrow_address').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 取引テーブル
export const transactions = pgTable("transactions", {
  txId: uuid('tx_id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => listings.id),
  buyerWalletAddress: text('buyer_wallet_address').notNull(),
  buyerId: uuid('buyer_id').notNull().references(() => users.id),
  priceUsdc: numeric('price_usdc').notNull(),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
  txHash: text("tx_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 価値評価レポートテーブル
export const valuationReports = pgTable("valuation_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  nftProjectId: uuid('nft_project_id').notNull().references(() => nftProjects.id),
  estimatedValueUsd: numeric('estimated_value_usd').notNull(),
  modelVersion: text("model_version").notNull(),
  commentaryText: text("commentary_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// プロジェクト開示情報テーブル
export const projectDisclosures = pgTable("project_disclosures", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => nftProjects.id),
  disclosureType: disclosureTypeEnum('disclosure_type').notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
})

// リレーション定義
export const usersRelations = relations(users, ({ many }) => ({
  nftProjects: many(nftProjects),
}))

export const nftProjectsRelations = relations(nftProjects, ({ one, many }) => ({
  owner: one(users, {
    fields: [nftProjects.ownerId],
    references: [users.id],
  }),
  listings: many(listings),
  valuationReports: many(valuationReports),
  disclosures: many(projectDisclosures),
}))

export const listingsRelations = relations(listings, ({ one }) => ({
  project: one(nftProjects, {
    fields: [listings.nftProjectId],
    references: [nftProjects.id],
  }),
  transaction: one(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  listing: one(listings, {
    fields: [transactions.listingId],
    references: [listings.id],
  }),
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
  }),
}))

export const valuationReportsRelations = relations(valuationReports, ({ one }) => ({
  project: one(nftProjects, {
    fields: [valuationReports.nftProjectId],
    references: [nftProjects.id],
  }),
}))

export const projectDisclosuresRelations = relations(projectDisclosures, ({ one }) => ({
  project: one(nftProjects, {
    fields: [projectDisclosures.projectId],
    references: [nftProjects.id],
  }),
}))
