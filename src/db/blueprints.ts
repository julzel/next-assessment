import { desc, eq } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

import type {
  BlueprintDraft,
  BlueprintSummary,
  BrandBlueprintConfig,
  TemplateId,
} from "@/lib/blueprint/types"
import {
  validateBlueprintConfig,
  validateBlueprintDraft,
  validateBlueprintSummary,
} from "@/lib/blueprint/validation"

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

export class InvalidPersistedBlueprintError extends Error {
  constructor() {
    super("The saved blueprint record is invalid or uses an unsupported schema version.")
    this.name = "InvalidPersistedBlueprintError"
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function migrateBlueprintConfig(config: unknown): BrandBlueprintConfig {
  if (!isRecord(config)) throw new InvalidPersistedBlueprintError()

  switch (config.schemaVersion) {
    case 1: {
      const result = validateBlueprintConfig(config)
      if (!result.success) throw new InvalidPersistedBlueprintError()
      return result.data
    }
    default:
      throw new InvalidPersistedBlueprintError()
  }
}

function toDraft(row: Blueprint): PersistedBlueprintDraft {
  const persisted = {
    id: row.id,
    brandName: row.brandName,
    template: row.template,
    config: migrateBlueprintConfig(row.config),
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  }
  const result = validateBlueprintDraft(persisted)
  if (!result.success) throw new InvalidPersistedBlueprintError()

  return { ...result.data, id: row.id, createdAt: persisted.createdAt, updatedAt: persisted.updatedAt }
}

function toSummary(row: Blueprint): BlueprintSummary {
  const result = validateBlueprintSummary({
    id: row.id,
    brandName: row.brandName,
    template: row.template,
    updatedAt: toIsoString(row.updatedAt),
  })
  if (!result.success) throw new InvalidPersistedBlueprintError()
  return result.data
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
