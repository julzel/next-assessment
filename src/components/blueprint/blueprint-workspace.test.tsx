import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { BlueprintDraft, BrandAnswers } from "@/lib/blueprint/types"

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }))
const actions = vi.hoisted(() => ({ saveBlueprint: vi.fn(), refineBlueprint: vi.fn() }))

vi.mock("next/navigation", () => ({ useRouter: () => router }))
vi.mock("@/app/blueprints/actions", () => actions)

import { BlueprintWorkspace } from "./blueprint-workspace"

const draft: BlueprintDraft = {
  id: null,
  brandName: "Northstar",
  template: "editorial",
  config: createEmptyBlueprintConfig(),
  createdAt: null,
  updatedAt: null,
}

const completeAnswers: BrandAnswers = {
  offerAudience: "Precision services for clients who value a calm visit",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "minimal",
  colorDirection: "cool",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "thoughtful expertise and care",
  avoid: "pressure or beauty stereotypes",
}

const completeDraft: BlueprintDraft = {
  ...draft,
  config: {
    schemaVersion: 1,
    answers: completeAnswers,
    content: buildDeterministicContent(completeAnswers),
  },
}
const refinedAnswers: BrandAnswers = {
  ...completeAnswers,
  voiceTraits: ["warm", "playful"],
  alwaysCommunicate: "Every client feels heard and welcome",
}
const refinedDraft: BlueprintDraft = {
  ...completeDraft,
  config: {
    schemaVersion: 1,
    answers: refinedAnswers,
    content: buildDeterministicContent(refinedAnswers),
  },
}

describe("BlueprintWorkspace", () => {
  afterEach(cleanup)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("identifies a new blueprint as unsaved before its first edit or save", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    expect(screen.getByText("Not saved yet")).not.toBeNull()
    expect(screen.queryByText("Saved")).toBeNull()
  })

  it("updates the name and template preview immediately", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    fireEvent.change(screen.getByLabelText("Salon name"), {
      target: { value: "Northstar Collective" },
    })
    fireEvent.click(screen.getByRole("radio", { name: /Neighborhood Welcome/ }))

    expect(screen.getAllByText("Northstar Collective").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Neighborhood Welcome").length).toBeGreaterThan(1)
    expect(screen.getByText("Unsaved changes")).not.toBeNull()
  })

  it("previews each template composition before selection", () => {
    const { container } = render(<BlueprintWorkspace initialDraft={draft} />)

    for (const template of ["editorial", "studio", "warm"]) {
      expect(container.querySelector(`[data-template-thumbnail="${template}"]`)).not.toBeNull()
    }
    expect(
      screen.getByText(
        /Composition: Campaign masthead, crafted service story, refined booking cue/,
      ),
    ).not.toBeNull()
    expect(screen.getByRole("radio", { name: /Editorial/ }).getAttribute("aria-checked")).toBe(
      "true",
    )
  })

  it("updates the dependent blueprint preview as guided answers change", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    fireEvent.click(screen.getByRole("button", { name: /^2\. Personality/ }))
    fireEvent.click(screen.getByRole("radio", { name: /Elegant/ }))

    expect(
      screen.getAllByText("A distinctive, elegant salon brand expression.").length,
    ).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole("button", { name: /^3\. Visual system/ }))
    fireEvent.click(screen.getByRole("radio", { name: /Earthy/ }))
    expect(screen.getAllByText(/earthy-leaning color/).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole("button", { name: /^4\. Voice/ }))
    fireEvent.change(screen.getByLabelText("What should salon communication avoid? (Optional)"), {
      target: { value: "pressure or beauty stereotypes" },
    })
    expect(
      screen.getByText("Avoid pressure or beauty stereotypes in client-facing communication."),
    ).not.toBeNull()
  })

  it("preserves unsaved values while switching templates and mobile modes", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    fireEvent.change(screen.getByLabelText("Salon name"), {
      target: { value: "Northstar Collective" },
    })
    fireEvent.change(
      screen.getByLabelText("What experience does your salon offer, and who is it for?"),
      { target: { value: "Precision services for clients who value thoughtful care" } },
    )
    fireEvent.click(screen.getByRole("radio", { name: /Neighborhood Welcome/ }))
    fireEvent.click(screen.getByRole("tab", { name: "Preview" }))
    fireEvent.click(screen.getByRole("tab", { name: "Questions" }))

    expect((screen.getByLabelText("Salon name") as HTMLInputElement).value).toBe(
      "Northstar Collective",
    )
    expect(
      screen.getByDisplayValue("Precision services for clients who value thoughtful care"),
    ).not.toBeNull()
    expect(screen.getAllByText("Neighborhood Welcome").length).toBeGreaterThan(1)
    expect(screen.getByText("Unsaved changes")).not.toBeNull()
  })

  it("supports arrow-key navigation between mobile edit and preview modes", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    const questions = screen.getByRole("tab", { name: "Questions" })
    fireEvent.keyDown(questions, { key: "ArrowRight" })

    expect(screen.getByRole("tab", { name: "Preview" }).getAttribute("aria-selected")).toBe(
      "true",
    )
  })

  it("moves from mobile questions to the current preview impact without losing state", async () => {
    const { container } = render(<BlueprintWorkspace initialDraft={draft} />)
    fireEvent.change(
      screen.getByLabelText("What experience does your salon offer, and who is it for?"),
      { target: { value: "Precision services for clients who value thoughtful care" } },
    )
    fireEvent.click(screen.getByRole("button", { name: "View this change" }))

    expect(screen.getByRole("tab", { name: "Preview" }).getAttribute("aria-selected")).toBe(
      "true",
    )
    const audience = container.querySelector<HTMLElement>(
      '[data-blueprint-section="audience-promise"]',
    )
    await waitFor(() => expect(document.activeElement).toBe(audience))
    fireEvent.click(screen.getByRole("tab", { name: "Questions" }))

    expect(
      screen.getByDisplayValue("Precision services for clients who value thoughtful care"),
    ).not.toBeNull()
    expect(
      screen.getByRole("button", { name: /1\. Foundation/ }).getAttribute("aria-current"),
    ).toBe("step")
  })

  it("updates the compact impact and full preview from the same answer change", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)
    fireEvent.change(
      screen.getByLabelText("What experience does your salon offer, and who is it for?"),
      { target: { value: "Color and care for clients with busy schedules" } },
    )

    expect(
      screen.getAllByText(/Color and care for clients with busy schedules/).length,
    ).toBeGreaterThanOrEqual(2)
    fireEvent.click(screen.getByRole("button", { name: "Full preview" }))
    expect(
      screen.getAllByText(/Color and care for clients with busy schedules/).length,
    ).toBeGreaterThanOrEqual(3)
  })

  it("keeps IDs unique when the editor and full preview are both mounted", () => {
    render(<BlueprintWorkspace initialDraft={completeDraft} />)
    fireEvent.click(screen.getByRole("button", { name: /^4\. Voice/ }))
    expect(screen.getByRole("button", { name: "Review blueprint" }).hasAttribute("disabled")).toBe(
      false,
    )
    fireEvent.click(screen.getByRole("button", { name: "Full preview" }))
    const ids = Array.from(document.querySelectorAll("[id]"), (element) => element.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it("shows the current unsaved draft in full preview and restores focus on Escape", async () => {
    render(<BlueprintWorkspace initialDraft={draft} />)
    fireEvent.change(screen.getByLabelText("Salon name"), {
      target: { value: "Northstar Collective" },
    })
    const fullPreviewButton = screen.getByRole("button", { name: "Full preview" })
    fireEvent.click(fullPreviewButton)

    expect(screen.getByRole("dialog")).not.toBeNull()
    expect(screen.getAllByText("Northstar Collective").length).toBeGreaterThan(1)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("dialog")).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(fullPreviewButton))
    expect((screen.getByLabelText("Salon name") as HTMLInputElement).value).toBe(
      "Northstar Collective",
    )
  })

  it("preserves local values and reports a returned save failure", async () => {
    actions.saveBlueprint.mockResolvedValue({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Check the highlighted blueprint details and try again.",
    })
    render(<BlueprintWorkspace initialDraft={draft} />)
    fireEvent.change(screen.getByLabelText("Salon name"), {
      target: { value: "Northstar Collective" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }))

    await waitFor(() => {
      expect(screen.getByText("Check the highlighted blueprint details and try again.")).not.toBeNull()
    })
    expect((screen.getByLabelText("Salon name") as HTMLInputElement).value).toBe(
      "Northstar Collective",
    )
  })

  it("uses the returned saved record and routes a new blueprint to its addressable URL", async () => {
    actions.saveBlueprint.mockResolvedValue({
      ok: true,
      data: {
        ...draft,
        id: 12,
        createdAt: "2026-08-20T12:00:00.000Z",
        updatedAt: "2026-08-20T12:00:00.000Z",
      },
    })
    render(<BlueprintWorkspace initialDraft={draft} />)
    expect(document.querySelectorAll("[data-brand-application]")).toHaveLength(3)
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }))

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/blueprints/12"))
    expect(screen.getByText("All changes saved.")).not.toBeNull()
    expect(document.querySelectorAll("[data-brand-application]")).toHaveLength(3)
  })

  it("labels complete work as a blueprint and reviews the current draft", () => {
    render(<BlueprintWorkspace initialDraft={completeDraft} />)

    expect(screen.getByRole("button", { name: "Save blueprint" })).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: /^4\. Voice/ }))
    fireEvent.click(screen.getByRole("button", { name: "Review blueprint" }))

    expect(screen.getByRole("dialog")).not.toBeNull()
    expect(screen.getAllByText("Northstar").length).toBeGreaterThan(1)
  })

  it("renders structured save issues beside the relevant fields", async () => {
    actions.saveBlueprint.mockResolvedValue({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Check the highlighted blueprint details and try again.",
      issues: [
        { path: "draft.brandName", message: "Choose a valid brand name." },
        { path: "answers.offerAudience", message: "Describe the audience." },
      ],
    })
    render(<BlueprintWorkspace initialDraft={draft} />)
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }))

    await waitFor(() => expect(screen.getByText("Choose a valid brand name.")).not.toBeNull())
    expect(screen.getByText("Describe the audience.")).not.toBeNull()
    expect(screen.getByLabelText("Salon name").getAttribute("aria-invalid")).toBe("true")
    expect(
      screen
        .getByLabelText("What experience does your salon offer, and who is it for?")
        .getAttribute("aria-invalid"),
    ).toBe("true")
  })

  it("gates AI refinement until the guided draft is complete", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    expect(screen.getByRole("button", { name: "Refine with AI" }).hasAttribute("disabled")).toBe(
      true,
    )
    expect(screen.getByText(/Complete all four guided steps/)).not.toBeNull()
  })

  it("applies an AI result to controls and preview, marks it unsaved, and undoes once", async () => {
    actions.refineBlueprint.mockResolvedValue({
      ok: true,
      data: {
        draft: refinedDraft,
        changeSummary: "Made the salon voice warmer and more playful.",
      },
    })
    render(<BlueprintWorkspace initialDraft={completeDraft} />)
    fireEvent.change(screen.getByLabelText("What should change?"), {
      target: { value: "Make the voice warmer and more playful" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Refine with AI" }))

    await waitFor(() =>
      expect(screen.getByText(/Made the salon voice warmer and more playful/)).not.toBeNull(),
    )
    expect(screen.getByText("Unsaved changes")).not.toBeNull()
    expect(screen.getAllByText(/warm and playful voice/).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole("button", { name: "Undo AI edit" }))
    expect(screen.queryByRole("button", { name: "Undo AI edit" })).toBeNull()
    expect(screen.getAllByText(/clear and thoughtful voice/).length).toBeGreaterThan(0)
  })

  it("prevents duplicate refinement and keeps the prior draft on a safe failure", async () => {
    let finishRequest: ((value: unknown) => void) | undefined
    actions.refineBlueprint.mockReturnValue(
      new Promise((resolve) => {
        finishRequest = resolve
      }),
    )
    render(<BlueprintWorkspace initialDraft={completeDraft} />)
    fireEvent.change(screen.getByLabelText("What should change?"), {
      target: { value: "Make the voice warmer" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Refine with AI" }))

    expect(screen.getByRole("button", { name: "Refining…" }).hasAttribute("disabled")).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Refining…" }))
    expect(actions.refineBlueprint).toHaveBeenCalledTimes(1)

    finishRequest?.({
      ok: false,
      code: "AI_FAILED",
      message: "AI refinement is temporarily unavailable. Your blueprint was not changed.",
    })
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain("temporarily unavailable"),
    )
    expect(screen.getAllByText(/clear and thoughtful voice/).length).toBeGreaterThan(0)
  })

  it("saves an applied AI result only after explicit confirmation", async () => {
    actions.refineBlueprint.mockResolvedValue({
      ok: true,
      data: { draft: refinedDraft, changeSummary: "Made the voice warmer." },
    })
    actions.saveBlueprint.mockImplementation(async (input: BlueprintDraft) => ({
      ok: true,
      data: {
        ...input,
        id: 18,
        createdAt: "2026-08-20T12:00:00.000Z",
        updatedAt: "2026-08-20T12:00:00.000Z",
      },
    }))
    render(<BlueprintWorkspace initialDraft={completeDraft} />)
    fireEvent.change(screen.getByLabelText("What should change?"), {
      target: { value: "Make the voice warmer" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Refine with AI" }))
    await waitFor(() => expect(screen.getByRole("button", { name: "Undo AI edit" })).not.toBeNull())

    expect(actions.saveBlueprint).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "Save blueprint" }))
    await waitFor(() => expect(actions.saveBlueprint).toHaveBeenCalledWith(refinedDraft))
    expect(screen.getByText("All changes saved.")).not.toBeNull()
    expect(screen.queryByRole("button", { name: "Undo AI edit" })).toBeNull()
  })
})
