import type { BlueprintDraft, TemplateId } from "./types"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

export type BlueprintWorkspaceState = {
  baseline: BlueprintDraft
  draft: BlueprintDraft
  saveStatus: SaveStatus
  saveMessage: string | null
}

export type BlueprintWorkspaceAction =
  | { type: "brandNameChanged"; brandName: string }
  | { type: "templateChanged"; template: TemplateId }
  | { type: "saveStarted" }
  | { type: "saveSucceeded"; draft: BlueprintDraft }
  | { type: "saveFailed"; message: string }

export function createBlueprintWorkspaceState(draft: BlueprintDraft): BlueprintWorkspaceState {
  return {
    baseline: draft,
    draft,
    saveStatus: "idle",
    saveMessage: null,
  }
}

export function isBlueprintDirty(state: BlueprintWorkspaceState) {
  return JSON.stringify(state.baseline) !== JSON.stringify(state.draft)
}

export function blueprintWorkspaceReducer(
  state: BlueprintWorkspaceState,
  action: BlueprintWorkspaceAction,
): BlueprintWorkspaceState {
  switch (action.type) {
    case "brandNameChanged":
      return {
        ...state,
        draft: { ...state.draft, brandName: action.brandName },
        saveStatus: "idle",
        saveMessage: null,
      }
    case "templateChanged":
      return {
        ...state,
        draft: { ...state.draft, template: action.template },
        saveStatus: "idle",
        saveMessage: null,
      }
    case "saveStarted":
      return { ...state, saveStatus: "saving", saveMessage: null }
    case "saveSucceeded":
      return {
        baseline: action.draft,
        draft: action.draft,
        saveStatus: "saved",
        saveMessage: "All changes saved.",
      }
    case "saveFailed":
      return { ...state, saveStatus: "error", saveMessage: action.message }
  }
}
