import { applyManualAnswer } from "./content"
import type { BlueprintStepId } from "./progress"
import type { BrandAnswers, BlueprintDraft, TemplateId } from "./types"
import type { ValidationIssue } from "./validation"

export type SaveStatus = "idle" | "saving" | "saved" | "error"
export type AiStatus = "idle" | "loading" | "applied" | "error"
export type WorkspaceMobileMode = "questions" | "preview"

export type BlueprintWorkspaceState = {
  baseline: BlueprintDraft
  draft: BlueprintDraft
  revision: number
  saveStatus: SaveStatus
  saveRevision: number | null
  saveMessage: string | null
  mobileMode: WorkspaceMobileMode
  fullPreviewOpen: boolean
  currentStep: BlueprintStepId
  fieldIssues: ValidationIssue[]
  aiStatus: AiStatus
  aiRevision: number | null
  aiMessage: string | null
  lastAiSnapshot: BlueprintDraft | null
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
  | { type: "aiStarted" }
  | { type: "aiSucceeded"; draft: BlueprintDraft; changeSummary: string }
  | { type: "aiFailed"; message: string }
  | { type: "aiReverted" }

export type AnswerChangedAction = {
  [K in keyof BrandAnswers]: { type: "answerChanged"; field: K; value: BrandAnswers[K] }
}[keyof BrandAnswers]

export function createBlueprintWorkspaceState(draft: BlueprintDraft): BlueprintWorkspaceState {
  return {
    baseline: draft,
    draft,
    revision: 0,
    saveStatus: "idle",
    saveRevision: null,
    saveMessage: null,
    mobileMode: "questions",
    fullPreviewOpen: false,
    currentStep: "foundation",
    fieldIssues: [],
    aiStatus: "idle",
    aiRevision: null,
    aiMessage: null,
    lastAiSnapshot: null,
  }
}

function withManualChange(
  state: BlueprintWorkspaceState,
  draft: BlueprintDraft,
): BlueprintWorkspaceState {
  return {
    ...state,
    draft,
    revision: state.revision + 1,
    saveStatus: state.saveStatus === "saving" ? "saving" : "idle",
    saveMessage: state.saveStatus === "saving" ? state.saveMessage : null,
    fieldIssues: [],
    aiStatus: state.aiStatus === "loading" ? "loading" : "idle",
    aiMessage: state.aiStatus === "loading" ? state.aiMessage : null,
    lastAiSnapshot: null,
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
      return withManualChange(state, { ...state.draft, brandName: action.brandName })
    case "templateChanged":
      return withManualChange(state, { ...state.draft, template: action.template })
    case "answerChanged":
      return withManualChange(state, {
        ...state.draft,
        config: applyManualAnswer(state.draft.config, action.field, action.value),
      })
    case "mobileModeChanged":
      return { ...state, mobileMode: action.mode }
    case "viewCurrentStep":
      return { ...state, mobileMode: "preview" }
    case "fullPreviewChanged":
      return { ...state, fullPreviewOpen: action.open }
    case "stepChanged":
      return { ...state, currentStep: action.step }
    case "saveStarted":
      if (state.saveStatus === "saving" || state.aiStatus === "loading") return state
      return {
        ...state,
        saveStatus: "saving",
        saveRevision: state.revision,
        saveMessage: null,
        fieldIssues: [],
      }
    case "saveSucceeded": {
      const hasNewerChanges = state.saveRevision !== state.revision
      const currentDraft = hasNewerChanges
        ? {
            ...state.draft,
            id: action.draft.id,
            createdAt: action.draft.createdAt,
            updatedAt: action.draft.updatedAt,
          }
        : action.draft
      return {
        ...state,
        baseline: action.draft,
        draft: currentDraft,
        saveStatus: hasNewerChanges ? "idle" : "saved",
        saveRevision: null,
        saveMessage: hasNewerChanges
          ? "Submitted changes saved. Newer changes are still unsaved."
          : "All changes saved.",
        fieldIssues: [],
        aiStatus: "idle",
        aiRevision: null,
        aiMessage: null,
        lastAiSnapshot: null,
      }
    }
    case "saveFailed":
      return {
        ...state,
        saveStatus: "error",
        saveRevision: null,
        saveMessage: action.message,
        fieldIssues: action.issues ?? [],
      }
    case "aiStarted":
      if (state.aiStatus === "loading" || state.saveStatus === "saving") return state
      return {
        ...state,
        aiStatus: "loading",
        aiRevision: state.revision,
        aiMessage: "Refining the current Blueprint…",
      }
    case "aiSucceeded":
      if (state.aiRevision !== state.revision) {
        return {
          ...state,
          aiStatus: "idle",
          aiRevision: null,
          aiMessage: "AI edit was not applied because the Blueprint changed while refining. Review your changes and try again.",
          lastAiSnapshot: null,
        }
      }
      return {
        ...state,
        draft: action.draft,
        revision: state.revision + 1,
        saveStatus: "idle",
        saveMessage: null,
        fieldIssues: [],
        aiStatus: "applied",
        aiRevision: null,
        aiMessage: `${action.changeSummary} Review the result, undo it, or save when ready.`,
        lastAiSnapshot: state.draft,
      }
    case "aiFailed":
      return {
        ...state,
        aiStatus: "error",
        aiRevision: null,
        aiMessage: action.message,
      }
    case "aiReverted":
      if (!state.lastAiSnapshot) return state
      return {
        ...state,
        draft: state.lastAiSnapshot,
        revision: state.revision + 1,
        saveStatus: "idle",
        saveMessage: null,
        aiStatus: "idle",
        aiMessage: "AI edit undone. The previous local draft is restored.",
        lastAiSnapshot: null,
      }
  }
}
