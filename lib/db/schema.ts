import { relations } from "drizzle-orm"
import { boolean, doublePrecision, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { ProjectStatus } from "./enums"

// ユーザーテーブル
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  sub: text("sub").notNull().unique(), // Dynamic IDを保存
  address: text("address").notNull().default(""),
  chain: text("chain").notNull().default(""),
  dynamicWalletId: text("dynamic_wallet_id").notNull().default("").unique(), // WalletのIDを保存
  twitterUsername: text("twitter_username"),
  twitterProfileImageUrl: text("twitter_profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// NFTプロジェクトテーブル
export const nftProjects = pgTable("nft_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  image: text("image"),
  collectionAddress: text("collection_address").notNull(),
  chainId: text("chain_id").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["Art", "PFP", "Game", "Music", "Utility"] }).notNull(),
  ltmRevenueUSD: doublePrecision("ltm_revenue_usd"), // 直近12か月の収益総額（USD換算）
  ownerId: uuid("owner_id").references(() => users.id),
  status: text("status", { enum: ["draft", "active", "suspended", "sold", "deleted"] }).notNull().default(ProjectStatus.DRAFT),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 出品リストテーブル
export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => nftProjects.id, { onDelete: "cascade" })
    .notNull(),
  saleId: integer("sale_id"),
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
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  priceUSDC: doublePrecision("price_usdc").notNull(),
  txHash: text("tx_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// 価値評価レポートテーブル
export const valuationReports = pgTable("valuation_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => nftProjects.id, { onDelete: "cascade" })
    .notNull(),
  estimatedValueUSD: doublePrecision("estimated_value_usd").notNull(),
  modelVersion: text("model_version").notNull(), // 使用されたAIモデルのバージョン
  report: text("commentary_text").notNull(), // AIによる評価コメント
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

// 通知テーブル
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  type: text("type", { 
    enum: ["purchase"] 
  }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  projectId: uuid("project_id")
    .references(() => nftProjects.id)
    .notNull(),
  read: boolean("read").notNull().default(false),
  metadata: jsonb("metadata"), // 通知の種類に応じた追加情報（例：価格、ステータス変更前後の値など）
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// リレーション定義
export const usersRelations = relations(users, ({ many, one }) => ({
  nftProjects: many(nftProjects),
  notifications: many(notifications),
}))

export const nftProjectsRelations = relations(nftProjects, ({ many, one }) => ({
  owner: one(users, {
    fields: [nftProjects.ownerId],
    references: [users.id],
  }),
  listing: one(listings),
  valuationReports: many(valuationReports),
  disclosures: many(projectDisclosures),
  notifications: many(notifications),
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
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
    relationName: "user",
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

// 通知のリレーション定義
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  project: one(nftProjects, {
    fields: [notifications.projectId],
    references: [nftProjects.id],
  }),
}))

export type User = typeof users.$inferSelect;
export type NftProject = typeof nftProjects.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type ValuationReport = typeof valuationReports.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ProjectDisclosure = typeof projectDisclosures.$inferSelect;
