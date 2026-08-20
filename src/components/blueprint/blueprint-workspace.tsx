"use client"

import { useReducer } from "react"
import { useRouter } from "next/navigation"

import { saveBlueprint } from "@/app/blueprints/actions"
import { BlueprintPreview } from "@/components/blueprint/blueprint-preview"
import { WorkspaceHeader } from "@/components/blueprint/workspace-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  blueprintWorkspaceReducer,
  createBlueprintWorkspaceState,
  isBlueprintDirty,
} from "@/lib/blueprint/reducer"
import type { BlueprintDraft, TemplateId } from "@/lib/blueprint/types"

const templates: { id: TemplateId; label: string; description: string }[] = [
  { id: "editorial", label: "Editorial", description: "Refined and typography-led" },
  { id: "studio", label: "Studio", description: "Clean and modular" },
  { id: "warm", label: "Warm", description: "Approachable and expressive" },
]

export function BlueprintWorkspace({ initialDraft }: { initialDraft: BlueprintDraft }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    blueprintWorkspaceReducer,
    initialDraft,
    createBlueprintWorkspaceState,
  )
  const dirty = isBlueprintDirty(state)

  async function handleSave() {
    dispatch({ type: "saveStarted" })
    const result = await saveBlueprint(state.draft)

    if (!result.ok) {
      dispatch({ type: "saveFailed", message: result.message })
      return
    }

    dispatch({ type: "saveSucceeded", draft: result.data })
    if (state.draft.id === null) {
      router.replace(`/blueprints/${result.data.id}`)
    } else {
      router.refresh()
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8 sm:py-12">
      <WorkspaceHeader
        brandName={state.draft.brandName}
        isDirty={dirty}
        saveStatus={state.saveStatus}
        saveMessage={state.saveMessage}
        onSave={handleSave}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section aria-labelledby="setup-heading" className="space-y-7">
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
            />
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Presentation template</legend>
            <RadioGroup
              value={state.draft.template}
              onValueChange={(value) => dispatch({ type: "templateChanged", template: value as TemplateId })}
              className="gap-3"
            >
              {templates.map((template) => (
                <Label
                  key={template.id}
                  htmlFor={`template-${template.id}`}
                  className="cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/5"
                >
                  <RadioGroupItem id={`template-${template.id}`} value={template.id} />
                  <span className="grid gap-1">
                    <span>{template.label}</span>
                    <span className="font-normal text-muted-foreground">{template.description}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
        </section>
        <section aria-label="Live blueprint preview" className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-sm font-medium text-primary">Live preview</p>
          <BlueprintPreview draft={state.draft} />
        </section>
      </div>
    </main>
  )
}
