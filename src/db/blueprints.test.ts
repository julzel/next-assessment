import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { afterEach, describe, expect, it } from "vitest"

import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { BrandAnswers } from "@/lib/blueprint/types"

import { createBlueprintRepository } from "./blueprints"
import * as schema from "./schema"

const answers: BrandAnswers = {
  offerAudience: "Independent founders",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "minimal",
  colorDirection: "cool",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "useful clarity",
  avoid: "jargon",
}

const config = {
  schemaVersion: 1 as const,
  answers,
  content: buildDeterministicContent(answers),
}

const sqliteConnections: Database.Database[] = []

function makeRepository(now: () => Date = () => new Date()) {
  const sqlite = new Database(":memory:")
  sqliteConnections.push(sqlite)
  sqlite.exec(`
    CREATE TABLE blueprints (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      brand_name TEXT NOT NULL,
      template TEXT NOT NULL,
      config TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `)
  return createBlueprintRepository(drizzle(sqlite, { schema }), now)
}

afterEach(() => {
  for (const sqlite of sqliteConnections.splice(0)) sqlite.close()
})

describe("blueprint repository", () => {
  it("inserts a blueprint and returns a library summary", () => {
    const repository = makeRepository()

    const saved = repository.insertBlueprint({
      brandName: "Northstar Studio",
      template: "editorial",
      config,
    })

    expect(saved).toMatchObject({
      id: 1,
      brandName: "Northstar Studio",
      template: "editorial",
      config,
    })
    expect(saved.createdAt).toEqual(expect.any(String))
    expect(repository.listBlueprints()).toEqual([
      {
        id: saved.id,
        brandName: "Northstar Studio",
        template: "editorial",
        updatedAt: saved.updatedAt,
      },
    ])
  })

  it("returns a JSON-safe full DTO by id and null when absent", () => {
    const repository = makeRepository()
    const saved = repository.insertBlueprint({
      brandName: "Northstar Studio",
      template: "studio",
      config,
    })

    expect(repository.getBlueprint(saved.id)).toEqual(saved)
    expect(JSON.parse(JSON.stringify(repository.getBlueprint(saved.id)))).toEqual(saved)
    expect(repository.getBlueprint(999)).toBeNull()
  })

  it("updates an existing record, advances its timestamp, and preserves config JSON", () => {
    let clock = new Date("2026-08-20T12:00:00.000Z")
    const repository = makeRepository(() => clock)
    const saved = repository.insertBlueprint({
      brandName: "Northstar Studio",
      template: "editorial",
      config,
    })
    clock = new Date("2026-08-20T12:00:01.000Z")
    const nextConfig = {
      ...config,
      content: { ...config.content, essence: "A refined saved essence." },
    }

    const updated = repository.updateBlueprint(saved.id, {
      brandName: "Northstar Collective",
      template: "warm",
      config: nextConfig,
    })

    expect(updated).toMatchObject({
      id: saved.id,
      brandName: "Northstar Collective",
      template: "warm",
      config: nextConfig,
    })
    expect(updated?.updatedAt).not.toBe(saved.updatedAt)
    expect(repository.getBlueprint(saved.id)?.config).toEqual(nextConfig)
  })

  it("returns null when asked to update a missing record", () => {
    const repository = makeRepository()

    expect(
      repository.updateBlueprint(999, {
        brandName: "Missing",
        template: "warm",
        config,
      }),
    ).toBeNull()
  })
})
