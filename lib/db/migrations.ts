import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db } from "."

// マイグレーション関数
export async function runMigrations() {
  console.log("Running migrations...")

  try {
    // drizzle/migrations ディレクトリからマイグレーションを実行
    await migrate(db, { migrationsFolder: "drizzle/migrations" })
    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

// スクリプトとして実行された場合、マイグレーションを実行
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Unhandled error during migration:", err)
      process.exit(1)
    })
}
