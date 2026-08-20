"use client"

import { useEffect, useReducer, useRef } from "react"
import { useRouter } from "next/navigation"

import { saveBlueprint } from "@/app/blueprints/actions"
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
  const dirty = isBlueprintDirty(state)
  const complete = isBlueprintComplete(state.draft.config)
  const fieldErrors = getBlueprintFieldErrors(state.fieldIssues)

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
    dispatch({ type: "saveStarted" })
    const result = await saveBlueprint(state.draft)

    if (!result.ok) {
      dispatch({ type: "saveFailed", message: result.message, issues: result.issues })
      return
    }

    dispatch({ type: "saveSucceeded", draft: result.data })
    if (state.draft.id === null) {
      router.replace(`/blueprints/${result.data.id}`)
    } else {
      router.refresh()
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

  const activeImpact = BLUEPRINT_STEP_PREVIEW_IMPACTS[state.currentStep]

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 overflow-x-clip px-4 py-6 sm:gap-8 sm:px-6 sm:py-12">
      <WorkspaceHeader
        brandName={state.draft.brandName}
        isDirty={dirty}
        saveStatus={state.saveStatus}
        saveMessage={state.saveMessage}
        isComplete={complete}
        onSave={handleSave}
        onFullPreview={() => handleFullPreviewChange(true)}
        fullPreviewButtonRef={fullPreviewButtonRef}
      />
      <Tabs
        value={state.mobileMode}
        onValueChange={(value) => dispatch({ type: "mobileModeChanged", mode: value as "questions" | "preview" })}
        className="sticky top-0 z-20 bg-background py-2 lg:hidden"
      >
        <TabsList className="w-full">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </Tabs>
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
              Start with the brand identity
            </h2>
            <p className="text-sm text-muted-foreground">
              You can save this early direction now, then add the detailed brand questions next.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand or client name</Label>
            <Input
              id="brand-name"
              value={state.draft.brandName}
              onChange={(event) =>
                dispatch({ type: "brandNameChanged", brandName: event.currentTarget.value })
              }
              placeholder="e.g. Northstar Studio"
              autoComplete="organization"
              aria-invalid={Boolean(fieldErrors.brandName)}
              aria-describedby={fieldErrors.brandName ? "brand-name-help brand-name-error" : "brand-name-help"}
            />
            <p id="brand-name-help" className="text-sm text-muted-foreground">
              This name anchors the Blueprint header and saved library card.
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
              The template sets the overall composition. Later choices define its visual character.
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
