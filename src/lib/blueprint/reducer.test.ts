import { describe, expect, it } from "vitest"

import { createEmptyBlueprintConfig } from "./defaults"
import {
  blueprintWorkspaceReducer,
  createBlueprintWorkspaceState,
  isBlueprintDirty,
} from "./reducer"
import type { BlueprintDraft } from "./types"

const draft: BlueprintDraft = {
  id: null,
  brandName: "Northstar",
  template: "editorial",
  config: createEmptyBlueprintConfig(),
  createdAt: null,
  updatedAt: null,
}

describe("blueprint workspace reducer", () => {
  it("tracks identity changes as unsaved draft state", () => {
    const initial = createBlueprintWorkspaceState(draft)
    const changed = blueprintWorkspaceReducer(initial, {
      type: "templateChanged",
      template: "warm",
    })

    expect(isBlueprintDirty(initial)).toBe(false)
    expect(changed.draft.template).toBe("warm")
    expect(isBlueprintDirty(changed)).toBe(true)
  })

  it("keeps local values when a save fails", () => {
    const changed = blueprintWorkspaceReducer(createBlueprintWorkspaceState(draft), {
      type: "brandNameChanged",
      brandName: "Northstar Collective",
    })
    const failed = blueprintWorkspaceReducer(changed, {
      type: "saveFailed",
      message: "Could not save right now.",
    })

    expect(failed.draft.brandName).toBe("Northstar Collective")
    expect(failed.saveStatus).toBe("error")
    expect(failed.saveMessage).toBe("Could not save right now.")
  })

  it("uses the canonical saved DTO as the next baseline", () => {
    const changed = blueprintWorkspaceReducer(createBlueprintWorkspaceState(draft), {
      type: "brandNameChanged",
      brandName: "Northstar Collective",
    })
    const saved: BlueprintDraft = {
      ...changed.draft,
      id: 7,
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z",
    }
    const complete = blueprintWorkspaceReducer(changed, { type: "saveSucceeded", draft: saved })

    expect(complete.baseline).toEqual(saved)
    expect(complete.draft).toEqual(saved)
    expect(isBlueprintDirty(complete)).toBe(false)
    expect(complete.saveStatus).toBe("saved")
  })
})
