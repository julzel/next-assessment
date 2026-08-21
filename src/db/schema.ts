import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import type { BrandBlueprintConfig, TemplateId } from "@/lib/blueprint/types"

export const blueprints = sqliteTable("blueprints", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brandName: text("brand_name").notNull(),
  template: text("template").$type<TemplateId>().notNull(),
  config: text("config", { mode: "json" }).$type<BrandBlueprintConfig>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type Blueprint = typeof blueprints.$inferSelect
export type NewBlueprint = typeof blueprints.$inferInsert
