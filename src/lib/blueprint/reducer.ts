import { applyManualAnswer } from "./content"
import type { BrandAnswers, BlueprintDraft, TemplateId } from "./types"

export type SaveStatus = "idle" | "saving" | "saved" | "error"
export type WorkspaceMobileMode = "questions" | "preview"

export type BlueprintWorkspaceState = {
  baseline: BlueprintDraft
  draft: BlueprintDraft
  saveStatus: SaveStatus
  saveMessage: string | null
  mobileMode: WorkspaceMobileMode
  fullPreviewOpen: boolean
}

export type BlueprintWorkspaceAction =
  | { type: "brandNameChanged"; brandName: string }
  | { type: "templateChanged"; template: TemplateId }
  | AnswerChangedAction
  | { type: "mobileModeChanged"; mode: WorkspaceMobileMode }
  | { type: "fullPreviewChanged"; open: boolean }
  | { type: "saveStarted" }
  | { type: "saveSucceeded"; draft: BlueprintDraft }
  | { type: "saveFailed"; message: string }

export type AnswerChangedAction = {
  [K in keyof BrandAnswers]: { type: "answerChanged"; field: K; value: BrandAnswers[K] }
}[keyof BrandAnswers]

export function createBlueprintWorkspaceState(draft: BlueprintDraft): BlueprintWorkspaceState {
  return {
    baseline: draft,
    draft,
    saveStatus: "idle",
    saveMessage: null,
    mobileMode: "questions",
    fullPreviewOpen: false,
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
    case "answerChanged":
      return {
        ...state,
        draft: {
          ...state.draft,
          config: applyManualAnswer(state.draft.config, action.field, action.value),
        },
        saveStatus: "idle",
        saveMessage: null,
      }
    case "mobileModeChanged":
      return { ...state, mobileMode: action.mode }
    case "fullPreviewChanged":
      return { ...state, fullPreviewOpen: action.open }
    case "saveStarted":
      return { ...state, saveStatus: "saving", saveMessage: null }
    case "saveSucceeded":
      return {
        ...state,
        baseline: action.draft,
        draft: action.draft,
        saveStatus: "saved",
        saveMessage: "All changes saved.",
      }
    case "saveFailed":
      return { ...state, saveStatus: "error", saveMessage: action.message }
  }
}
