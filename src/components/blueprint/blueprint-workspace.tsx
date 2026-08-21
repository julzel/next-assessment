"use client"

import { useEffect, useReducer, useRef } from "react"
import type { KeyboardEvent } from "react"
import { useRouter } from "next/navigation"

import { refineBlueprint, saveBlueprint } from "@/app/blueprints/actions"
import { AiRefinementPanel } from "@/components/blueprint/ai-refinement-panel"
import { BlueprintPreview } from "@/components/blueprint/blueprint-preview"
import { FullPreviewOverlay } from "@/components/blueprint/full-preview-overlay"
import { GuidedEditor } from "@/components/blueprint/guided-editor"
import { LiveImpactSummary } from "@/components/blueprint/live-impact-summary"
import { TemplateOptionCard } from "@/components/blueprint/template-option-card"
import { WorkspaceHeader } from "@/components/blueprint/workspace-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AiRefinementTarget } from "@/lib/blueprint/ai-contract"
import { cn } from "@/lib/utils"
import { TEMPLATE_OPTIONS } from "@/lib/blueprint/options"
import {
  BLUEPRINT_STEP_PREVIEW_IMPACTS,
  getBlueprintFieldErrors,
  isBlueprintComplete,
} from "@/lib/blueprint/progress"
import {
  blueprintWorkspaceReducer,
  createBlueprintWorkspaceState,
  isBlueprintDirty,
} from "@/lib/blueprint/reducer"
import type { BlueprintDraft, TemplateId } from "@/lib/blueprint/types"

export function BlueprintWorkspace({ initialDraft }: { initialDraft: BlueprintDraft }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    blueprintWorkspaceReducer,
    initialDraft,
    createBlueprintWorkspaceState,
  )
  const fullPreviewButtonRef = useRef<HTMLButtonElement>(null)
  const previewPanelRef = useRef<HTMLElement>(null)
  const shouldRestorePreviewFocus = useRef(false)
  const shouldFocusStepImpact = useRef(false)
  const operationInFlightRef = useRef(false)
  const latestDraftRef = useRef(state.draft)
  const dirty = isBlueprintDirty(state)
  const complete = isBlueprintComplete(state.draft.config)
  const fieldErrors = getBlueprintFieldErrors(state.fieldIssues)

  useEffect(() => {
    latestDraftRef.current = state.draft
  }, [state.draft])

  useEffect(() => {
    if (!state.fullPreviewOpen && shouldRestorePreviewFocus.current) {
      shouldRestorePreviewFocus.current = false
      fullPreviewButtonRef.current?.focus()
    }
  }, [state.fullPreviewOpen])

  useEffect(() => {
    if (state.mobileMode !== "preview" || !shouldFocusStepImpact.current) return

    shouldFocusStepImpact.current = false
    const target = BLUEPRINT_STEP_PREVIEW_IMPACTS[state.currentStep].primarySection
    previewPanelRef.current
      ?.querySelector<HTMLElement>(`[data-blueprint-section="${target}"]`)
      ?.focus()
  }, [state.currentStep, state.mobileMode])

  async function handleSave() {
    if (operationInFlightRef.current) return
    operationInFlightRef.current = true
    const submittedDraft = state.draft
    dispatch({ type: "saveStarted" })
    try {
      const result = await saveBlueprint(submittedDraft)

      if (!result.ok) {
        dispatch({ type: "saveFailed", message: result.message, issues: result.issues })
        return
      }

      dispatch({ type: "saveSucceeded", draft: result.data })
      if (latestDraftRef.current === submittedDraft) {
        if (submittedDraft.id === null) {
          router.replace(`/blueprints/${result.data.id}`)
        } else {
          router.refresh()
        }
      }
    } catch {
      dispatch({
        type: "saveFailed",
        message: "The blueprint could not be saved. Your local changes are still here; try again.",
      })
    } finally {
      operationInFlightRef.current = false
    }
  }

  async function handleRefine(target: AiRefinementTarget, instruction: string) {
    if (!complete || operationInFlightRef.current) return
    operationInFlightRef.current = true
    const submittedDraft = state.draft
    dispatch({ type: "aiStarted" })

    try {
      const result = await refineBlueprint({ draft: submittedDraft, instruction, target })
      if (!result.ok) {
        dispatch({ type: "aiFailed", message: result.message })
        return
      }
      dispatch({
        type: "aiSucceeded",
        draft: result.data.draft,
        changeSummary: result.data.changeSummary,
      })
    } catch {
      dispatch({
        type: "aiFailed",
        message: "AI refinement could not be reached. Your Blueprint is unchanged; try again.",
      })
    } finally {
      operationInFlightRef.current = false
    }
  }

  function handleFullPreviewChange(open: boolean) {
    if (!open) {
      shouldRestorePreviewFocus.current = true
    }

    dispatch({ type: "fullPreviewChanged", open })
  }

  function handleViewCurrentStep() {
    shouldFocusStepImpact.current = true
    dispatch({ type: "viewCurrentStep" })
  }

  function handleMobileModeKeyboardNavigation(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return

    const mode =
      event.key === 'ArrowLeft' || event.key === 'Home' ? 'questions' : 'preview'
    event.preventDefault()
    event.stopPropagation()
    dispatch({ type: 'mobileModeChanged', mode })
    window.requestAnimationFrame(() => {
      Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(
        (tab) => tab.textContent === (mode === 'questions' ? 'Questions' : 'Preview'),
      )?.focus()
    })
  }

  const activeImpact = BLUEPRINT_STEP_PREVIEW_IMPACTS[state.currentStep]

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 overflow-x-clip px-4 py-6 sm:gap-8 sm:px-6 sm:py-12">
      <div
        data-workspace-toolbar
        className="sticky top-0 z-30 -mx-4 bg-background/95 px-4 backdrop-blur sm:-mx-6 sm:px-6"
      >
        <WorkspaceHeader
          brandName={state.draft.brandName}
          hasSavedRecord={state.draft.id !== null}
          isDirty={dirty}
          saveStatus={state.saveStatus}
          saveMessage={state.saveMessage}
          isComplete={complete}
          isAiPending={state.aiStatus === "loading"}
          onSave={handleSave}
          onFullPreview={() => handleFullPreviewChange(true)}
          fullPreviewButtonRef={fullPreviewButtonRef}
        />
        <Tabs
          value={state.mobileMode}
          onValueChange={(value) => dispatch({ type: "mobileModeChanged", mode: value as "questions" | "preview" })}
          className="pb-2 lg:hidden"
        >
          <TabsList className="w-full">
            <TabsTrigger value="questions" onKeyDown={handleMobileModeKeyboardNavigation}>
              Questions
            </TabsTrigger>
            <TabsTrigger value="preview" onKeyDown={handleMobileModeKeyboardNavigation}>
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <p className="sr-only" aria-live="polite">
        Editing {activeImpact.title}. The preview highlights {activeImpact.inputLabel.toLowerCase()}.
      </p>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section
          aria-labelledby="setup-heading"
          data-workspace-panel="questions"
          className={cn(
            "min-w-0 space-y-9",
            state.mobileMode === "questions" ? "block" : "hidden lg:block",
          )}
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Setup</p>
            <h2 id="setup-heading" className="text-xl font-semibold tracking-tight">
              Start with the salon identity
            </h2>
            <p className="text-sm text-muted-foreground">
              Add the salon name and choose how the guide is organized. Later decisions shape its
              look and voice across website, social, and print.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-name">Salon name</Label>
            <Input
              id="brand-name"
              value={state.draft.brandName}
              onChange={(event) =>
                dispatch({ type: "brandNameChanged", brandName: event.currentTarget.value })
              }
              placeholder="e.g. Northstar Salon"
              autoComplete="organization"
              aria-invalid={Boolean(fieldErrors.brandName)}
              aria-describedby={fieldErrors.brandName ? "brand-name-help brand-name-error" : "brand-name-help"}
            />
            <p id="brand-name-help" className="text-sm text-muted-foreground">
              This name anchors the Blueprint and saved salon library card.
            </p>
            {fieldErrors.brandName && (
              <p id="brand-name-error" className="text-sm text-destructive">
                {fieldErrors.brandName}
              </p>
            )}
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Presentation template</legend>
            <p className="text-sm text-muted-foreground">
              The template organizes the salon story. Later choices define its palette, type,
              shapes, and voice.
            </p>
            <RadioGroup
              value={state.draft.template}
              onValueChange={(value) => dispatch({ type: "templateChanged", template: value as TemplateId })}
              className="gap-3"
            >
              {TEMPLATE_OPTIONS.map((template) => (
                <TemplateOptionCard key={template.id} option={template} />
              ))}
            </RadioGroup>
          </fieldset>
          <GuidedEditor
            answers={state.draft.config.answers}
            currentStep={state.currentStep}
            fieldErrors={fieldErrors}
            onStepChange={(step) => dispatch({ type: "stepChanged", step })}
            onAnswerChange={(action) => dispatch(action)}
            onReview={() => handleFullPreviewChange(true)}
            mobileImpact={
              <LiveImpactSummary
                draft={state.draft}
                currentStep={state.currentStep}
                onView={handleViewCurrentStep}
              />
            }
          />
          <AiRefinementPanel
            isComplete={complete}
            isSavePending={state.saveStatus === "saving"}
            status={state.aiStatus}
            message={state.aiMessage}
            canUndo={state.lastAiSnapshot !== null}
            onRefine={handleRefine}
            onUndo={() => dispatch({ type: "aiReverted" })}
          />
        </section>
        <section
          ref={previewPanelRef}
          aria-label="Live blueprint preview"
          data-workspace-panel="preview"
          className={cn(
            "min-w-0 lg:sticky lg:top-8 lg:self-start",
            state.mobileMode === "preview" ? "block" : "hidden lg:block",
          )}
        >
          <p className="mb-3 text-sm font-medium text-primary">Live preview</p>
          <BlueprintPreview draft={state.draft} activeStep={state.currentStep} />
        </section>
      </div>
      <FullPreviewOverlay
        draft={state.draft}
        open={state.fullPreviewOpen}
        onOpenChange={handleFullPreviewChange}
      />
    </main>
  )
}
