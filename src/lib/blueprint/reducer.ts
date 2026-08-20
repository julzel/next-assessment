import { applyManualAnswer } from "./content"
import type { BlueprintStepId } from "./progress"
import type { BrandAnswers, BlueprintDraft, TemplateId } from "./types"
import type { ValidationIssue } from "./validation"

export type SaveStatus = "idle" | "saving" | "saved" | "error"
export type WorkspaceMobileMode = "questions" | "preview"

export type BlueprintWorkspaceState = {
  baseline: BlueprintDraft
  draft: BlueprintDraft
  saveStatus: SaveStatus
  saveMessage: string | null
  mobileMode: WorkspaceMobileMode
  fullPreviewOpen: boolean
  currentStep: BlueprintStepId
  fieldIssues: ValidationIssue[]
}

export type BlueprintWorkspaceAction =
  | { type: "brandNameChanged"; brandName: string }
  | { type: "templateChanged"; template: TemplateId }
  | AnswerChangedAction
  | { type: "mobileModeChanged"; mode: WorkspaceMobileMode }
  | { type: "viewCurrentStep" }
  | { type: "fullPreviewChanged"; open: boolean }
  | { type: "stepChanged"; step: BlueprintStepId }
  | { type: "saveStarted" }
  | { type: "saveSucceeded"; draft: BlueprintDraft }
  | { type: "saveFailed"; message: string; issues?: ValidationIssue[] }

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
    currentStep: "foundation",
    fieldIssues: [],
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
        fieldIssues: [],
      }
    case "templateChanged":
      return {
        ...state,
        draft: { ...state.draft, template: action.template },
        saveStatus: "idle",
        saveMessage: null,
        fieldIssues: [],
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
        fieldIssues: [],
      }
    case "mobileModeChanged":
      return { ...state, mobileMode: action.mode }
    case "viewCurrentStep":
      return { ...state, mobileMode: "preview" }
    case "fullPreviewChanged":
      return { ...state, fullPreviewOpen: action.open }
    case "stepChanged":
      return { ...state, currentStep: action.step }
    case "saveStarted":
      return { ...state, saveStatus: "saving", saveMessage: null, fieldIssues: [] }
    case "saveSucceeded":
      return {
        ...state,
        baseline: action.draft,
        draft: action.draft,
        saveStatus: "saved",
        saveMessage: "All changes saved.",
        fieldIssues: [],
      }
    case "saveFailed":
      return {
        ...state,
        saveStatus: "error",
        saveMessage: action.message,
        fieldIssues: action.issues ?? [],
      }
  }
}
