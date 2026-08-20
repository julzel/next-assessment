import { desc, eq } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import type {
  BlueprintDraft,
  BlueprintSummary,
  BrandBlueprintConfig,
  TemplateId,
} from "@/lib/blueprint/types"

import { db } from "."
import { blueprints, type Blueprint } from "./schema"
import type * as schema from "./schema"

export type ValidatedBlueprintInput = {
  brandName: string
  template: TemplateId
  config: BrandBlueprintConfig
}

export type PersistedBlueprintDraft = BlueprintDraft & {
  id: number
  createdAt: string
  updatedAt: string
}

type BlueprintDatabase = BetterSQLite3Database<typeof schema>
type Clock = () => Date

function toIsoString(date: Date) {
  return date.toISOString()
}

function toDraft(row: Blueprint): PersistedBlueprintDraft {
  return {
    id: row.id,
    brandName: row.brandName,
    template: row.template,
    config: row.config,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  }
}

function toSummary(row: Blueprint): BlueprintSummary {
  return {
    id: row.id,
    brandName: row.brandName,
    template: row.template,
    updatedAt: toIsoString(row.updatedAt),
  }
}

export function createBlueprintRepository(database: BlueprintDatabase, now: Clock = () => new Date()) {
  return {
    listBlueprints(): BlueprintSummary[] {
      return database
        .select()
        .from(blueprints)
        .orderBy(desc(blueprints.updatedAt), desc(blueprints.id))
        .all()
        .map(toSummary)
    },

    getBlueprint(id: number): PersistedBlueprintDraft | null {
      const row = database.select().from(blueprints).where(eq(blueprints.id, id)).get()
      return row ? toDraft(row) : null
    },

    insertBlueprint(input: ValidatedBlueprintInput): PersistedBlueprintDraft {
      const row = database.insert(blueprints).values(input).returning().get()
      return toDraft(row)
    },

    updateBlueprint(id: number, input: ValidatedBlueprintInput): PersistedBlueprintDraft | null {
      const row = database
        .update(blueprints)
        .set({ ...input, updatedAt: now() })
        .where(eq(blueprints.id, id))
        .returning()
        .get()
      return row ? toDraft(row) : null
    },
  }
}

const repository = createBlueprintRepository(db)

export const listBlueprints = repository.listBlueprints
export const getBlueprint = repository.getBlueprint
export const insertBlueprint = repository.insertBlueprint
export const updateBlueprint = repository.updateBlueprint
