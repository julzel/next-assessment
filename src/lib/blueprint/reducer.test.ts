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
    const saving = blueprintWorkspaceReducer(changed, { type: "saveStarted" })
    const complete = blueprintWorkspaceReducer(saving, { type: "saveSucceeded", draft: saved })

    expect(complete.baseline).toEqual(saved)
    expect(complete.draft).toEqual(saved)
    expect(isBlueprintDirty(complete)).toBe(false)
    expect(complete.saveStatus).toBe("saved")
  })

  it("keeps guided step state ephemeral and exposes returned field issues", () => {
    const onVoice = blueprintWorkspaceReducer(createBlueprintWorkspaceState(draft), {
      type: "stepChanged",
      step: "voice",
    })
    const failed = blueprintWorkspaceReducer(onVoice, {
      type: "saveFailed",
      message: "Check the highlighted details.",
      issues: [{ path: "answers.offerAudience", message: "Cannot be blank." }],
    })

    expect(failed.currentStep).toBe("voice")
    expect(failed.fieldIssues).toEqual([
      { path: "answers.offerAudience", message: "Cannot be blank." },
    ])

    const changed = blueprintWorkspaceReducer(failed, {
      type: "answerChanged",
      field: "offerAudience",
      value: "Support for independent founders",
    })
    expect(changed.fieldIssues).toEqual([])
  })

  it("opens the mobile preview for the current step without changing draft state", () => {
    const onVisual = blueprintWorkspaceReducer(createBlueprintWorkspaceState(draft), {
      type: "stepChanged",
      step: "visual",
    })
    const previewing = blueprintWorkspaceReducer(onVisual, { type: "viewCurrentStep" })

    expect(previewing.mobileMode).toBe("preview")
    expect(previewing.currentStep).toBe("visual")
    expect(previewing.draft).toBe(draft)
  })

  it("applies an AI draft locally and restores the exact prior snapshot once", () => {
    const initial = createBlueprintWorkspaceState(draft)
    const loading = blueprintWorkspaceReducer(initial, { type: "aiStarted" })
    const refinedDraft = {
      ...draft,
      config: {
        ...draft.config,
        content: { ...draft.config.content, voiceTone: "A warmer salon voice." },
      },
    }
    const applied = blueprintWorkspaceReducer(loading, {
      type: "aiSucceeded",
      draft: refinedDraft,
      changeSummary: "Made the voice warmer.",
    })

    expect(applied.draft).toEqual(refinedDraft)
    expect(applied.lastAiSnapshot).toBe(draft)
    expect(applied.aiStatus).toBe("applied")
    expect(isBlueprintDirty(applied)).toBe(true)

    const reverted = blueprintWorkspaceReducer(applied, { type: "aiReverted" })
    expect(reverted.draft).toBe(draft)
    expect(reverted.lastAiSnapshot).toBeNull()
    expect(blueprintWorkspaceReducer(reverted, { type: "aiReverted" })).toBe(reverted)
  })

  it("keeps the exact draft on AI failure and clears AI undo after manual edits or save", () => {
    const initial = createBlueprintWorkspaceState(draft)
    const failed = blueprintWorkspaceReducer(initial, {
      type: "aiFailed",
      message: "AI is unavailable.",
    })
    expect(failed.draft).toBe(draft)
    expect(failed.aiStatus).toBe("error")

    const loading = blueprintWorkspaceReducer(initial, { type: "aiStarted" })
    const applied = blueprintWorkspaceReducer(loading, {
      type: "aiSucceeded",
      draft: { ...draft, brandName: "AI should not do this" },
      changeSummary: "Applied a test edit.",
    })
    const manuallyChanged = blueprintWorkspaceReducer(applied, {
      type: "answerChanged",
      field: "avoid",
      value: "Pressure",
    })
    expect(manuallyChanged.lastAiSnapshot).toBeNull()
    expect(manuallyChanged.aiStatus).toBe("idle")

    const saving = blueprintWorkspaceReducer(applied, { type: "saveStarted" })
    const saved = blueprintWorkspaceReducer(saving, {
      type: "saveSucceeded",
      draft: applied.draft,
    })
    expect(saved.lastAiSnapshot).toBeNull()
    expect(saved.aiStatus).toBe("idle")
  })

  it("ignores duplicate AI start events while a request is pending", () => {
    const loading = blueprintWorkspaceReducer(createBlueprintWorkspaceState(draft), {
      type: "aiStarted",
    })

    expect(blueprintWorkspaceReducer(loading, { type: "aiStarted" })).toBe(loading)
  })

  it("preserves edits made during save and adopts the persisted identity without claiming they are saved", () => {
    const changed = blueprintWorkspaceReducer(createBlueprintWorkspaceState(draft), {
      type: "brandNameChanged",
      brandName: "Submitted name",
    })
    const saving = blueprintWorkspaceReducer(changed, { type: "saveStarted" })
    const editedWhileSaving = blueprintWorkspaceReducer(saving, {
      type: "brandNameChanged",
      brandName: "Newer local name",
    })
    const savedDraft: BlueprintDraft = {
      ...changed.draft,
      id: 14,
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z",
    }
    const completed = blueprintWorkspaceReducer(editedWhileSaving, {
      type: "saveSucceeded",
      draft: savedDraft,
    })

    expect(editedWhileSaving.saveStatus).toBe("saving")
    expect(completed.baseline).toEqual(savedDraft)
    expect(completed.draft).toMatchObject({ id: 14, brandName: "Newer local name" })
    expect(isBlueprintDirty(completed)).toBe(true)
    expect(completed.saveMessage).toContain("Newer changes are still unsaved")
  })

  it("discards a late AI result when the draft changed during refinement", () => {
    const loading = blueprintWorkspaceReducer(createBlueprintWorkspaceState(draft), {
      type: "aiStarted",
    })
    const edited = blueprintWorkspaceReducer(loading, {
      type: "brandNameChanged",
      brandName: "Newer local name",
    })
    const lateResult = blueprintWorkspaceReducer(edited, {
      type: "aiSucceeded",
      draft: { ...draft, brandName: "Stale name" },
      changeSummary: "Changed the voice.",
    })

    expect(edited.aiStatus).toBe("loading")
    expect(lateResult.draft.brandName).toBe("Newer local name")
    expect(lateResult.aiStatus).toBe("idle")
    expect(lateResult.aiMessage).toContain("was not applied")
    expect(lateResult.lastAiSnapshot).toBeNull()
  })
})
