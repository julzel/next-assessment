import { beforeEach, describe, expect, it, vi } from "vitest"

import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import type { BlueprintDraft } from "@/lib/blueprint/types"

const repository = vi.hoisted(() => ({
  insertBlueprint: vi.fn(),
  updateBlueprint: vi.fn(),
}))
const cache = vi.hoisted(() => ({ revalidatePath: vi.fn() }))

vi.mock("@/db/blueprints", () => repository)
vi.mock("next/cache", () => cache)

import { saveBlueprint } from "./actions"

const draft: BlueprintDraft = {
  id: null,
  brandName: "Northstar",
  template: "editorial",
  config: createEmptyBlueprintConfig(),
  createdAt: null,
  updatedAt: null,
}

describe("saveBlueprint", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("rejects invalid drafts before touching the repository", async () => {
    const result = await saveBlueprint({ ...draft, brandName: " " })

    expect(result).toMatchObject({ ok: false, code: "VALIDATION_ERROR" })
    expect(repository.insertBlueprint).not.toHaveBeenCalled()
  })

  it("returns not found when an existing blueprint cannot be updated", async () => {
    repository.updateBlueprint.mockReturnValue(null)

    const result = await saveBlueprint({
      ...draft,
      id: 99,
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z",
    })

    expect(result).toMatchObject({ ok: false, code: "NOT_FOUND" })
  })

  it("inserts valid drafts and returns the canonical saved DTO", async () => {
    const saved = {
      ...draft,
      id: 4,
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z",
    }
    repository.insertBlueprint.mockReturnValue(saved)

    await expect(saveBlueprint(draft)).resolves.toEqual({ ok: true, data: saved })
    expect(repository.insertBlueprint).toHaveBeenCalledWith({
      brandName: draft.brandName,
      template: draft.template,
      config: draft.config,
    })
    expect(cache.revalidatePath).toHaveBeenCalledWith("/")
  })
})
