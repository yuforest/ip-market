import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// 環境変数からデータベース接続情報を取得
const connectionString = process.env.DATABASE_URL

// 接続がない場合はエラーを投げる
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined")
}

// PostgreSQLクライアントを作成
const client = postgres(connectionString)

// Drizzle ORMインスタンスを作成
export const db = drizzle(client, { schema })

// 型エクスポート
export type DbClient = typeof db
