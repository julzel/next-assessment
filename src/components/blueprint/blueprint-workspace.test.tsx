import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { BlueprintDraft, BrandAnswers } from "@/lib/blueprint/types"

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }))
const actions = vi.hoisted(() => ({ saveBlueprint: vi.fn() }))

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
  offerAudience: "Independent founders building thoughtful products",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "minimal",
  colorDirection: "cool",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "calm, useful clarity",
  avoid: "empty buzzwords",
}

const completeDraft: BlueprintDraft = {
  ...draft,
  config: {
    schemaVersion: 1,
    answers: completeAnswers,
    content: buildDeterministicContent(completeAnswers),
  },
}

describe("BlueprintWorkspace", () => {
  afterEach(cleanup)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("updates the name and template preview immediately", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    fireEvent.change(screen.getByLabelText("Brand or client name"), {
      target: { value: "Northstar Collective" },
    })
    fireEvent.click(screen.getByRole("radio", { name: /Warm/ }))

    expect(screen.getAllByText("Northstar Collective").length).toBeGreaterThan(0)
    expect(screen.getByText("Warm blueprint")).not.toBeNull()
    expect(screen.getByText("Unsaved changes")).not.toBeNull()
  })

  it("previews each template composition before selection", () => {
    const { container } = render(<BlueprintWorkspace initialDraft={draft} />)

    for (const template of ["editorial", "studio", "warm"]) {
      expect(container.querySelector(`[data-template-thumbnail="${template}"]`)).not.toBeNull()
    }
    expect(screen.getByText(/Composition: Masthead, fine rule, flowing story/)).not.toBeNull()
    expect(screen.getByRole("radio", { name: /Editorial/ }).getAttribute("aria-checked")).toBe(
      "true",
    )
  })

  it("updates the dependent blueprint preview as guided answers change", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    fireEvent.click(screen.getByRole("button", { name: /^2\. Personality/ }))
    fireEvent.click(screen.getByRole("radio", { name: /Elegant/ }))

    expect(screen.getAllByText("A distinctive, elegant brand expression.").length).toBeGreaterThan(
      0,
    )
    fireEvent.click(screen.getByRole("button", { name: /^3\. Visual system/ }))
    fireEvent.click(screen.getByRole("radio", { name: /Earthy/ }))
    expect(screen.getAllByText(/earthy-leaning color/).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole("button", { name: /^4\. Voice/ }))
    fireEvent.change(screen.getByLabelText("What should the brand avoid? (Optional)"), {
      target: { value: "empty buzzwords" },
    })
    expect(screen.getByText("Avoid empty buzzwords.")).not.toBeNull()
  })

  it("preserves unsaved values while switching templates and mobile modes", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)

    fireEvent.change(screen.getByLabelText("Brand or client name"), {
      target: { value: "Northstar Collective" },
    })
    fireEvent.change(screen.getByLabelText("What does the brand offer, and who is it for?"), {
      target: { value: "Strategic support for independent founders" },
    })
    fireEvent.click(screen.getByRole("radio", { name: /Warm/ }))
    fireEvent.click(screen.getByRole("tab", { name: "Preview" }))
    fireEvent.click(screen.getByRole("tab", { name: "Questions" }))

    expect((screen.getByLabelText("Brand or client name") as HTMLInputElement).value).toBe(
      "Northstar Collective",
    )
    expect(screen.getByDisplayValue("Strategic support for independent founders")).not.toBeNull()
    expect(screen.getByText("Warm blueprint")).not.toBeNull()
    expect(screen.getByText("Unsaved changes")).not.toBeNull()
  })

  it("moves from mobile questions to the current preview impact without losing state", async () => {
    const { container } = render(<BlueprintWorkspace initialDraft={draft} />)
    fireEvent.change(screen.getByLabelText("What does the brand offer, and who is it for?"), {
      target: { value: "Strategic support for independent founders" },
    })
    fireEvent.click(screen.getByRole("button", { name: "View this change" }))

    expect(screen.getByRole("tab", { name: "Preview" }).getAttribute("aria-selected")).toBe(
      "true",
    )
    const audience = container.querySelector<HTMLElement>(
      '[data-blueprint-section="audience-promise"]',
    )
    await waitFor(() => expect(document.activeElement).toBe(audience))
    fireEvent.click(screen.getByRole("tab", { name: "Questions" }))

    expect(screen.getByDisplayValue("Strategic support for independent founders")).not.toBeNull()
    expect(
      screen.getByRole("button", { name: /1\. Foundation/ }).getAttribute("aria-current"),
    ).toBe("step")
  })

  it("updates the compact impact and full preview from the same answer change", () => {
    render(<BlueprintWorkspace initialDraft={draft} />)
    fireEvent.change(screen.getByLabelText("What does the brand offer, and who is it for?"), {
      target: { value: "Tools for thoughtful founders" },
    })

    expect(screen.getAllByText(/Tools for thoughtful founders/).length).toBeGreaterThanOrEqual(2)
    fireEvent.click(screen.getByRole("button", { name: "Full preview" }))
    expect(screen.getAllByText(/Tools for thoughtful founders/).length).toBeGreaterThanOrEqual(3)
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
    fireEvent.change(screen.getByLabelText("Brand or client name"), {
      target: { value: "Northstar Collective" },
    })
    const fullPreviewButton = screen.getByRole("button", { name: "Full preview" })
    fireEvent.click(fullPreviewButton)

    expect(screen.getByRole("dialog")).not.toBeNull()
    expect(screen.getAllByText("Northstar Collective").length).toBeGreaterThan(1)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("dialog")).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(fullPreviewButton))
    expect((screen.getByLabelText("Brand or client name") as HTMLInputElement).value).toBe(
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
    fireEvent.change(screen.getByLabelText("Brand or client name"), {
      target: { value: "Northstar Collective" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }))

    await waitFor(() => {
      expect(screen.getByText("Check the highlighted blueprint details and try again.")).not.toBeNull()
    })
    expect((screen.getByLabelText("Brand or client name") as HTMLInputElement).value).toBe(
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
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }))

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/blueprints/12"))
    expect(screen.getByText("All changes saved.")).not.toBeNull()
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
    expect(screen.getByLabelText("Brand or client name").getAttribute("aria-invalid")).toBe("true")
    expect(
      screen
        .getByLabelText("What does the brand offer, and who is it for?")
        .getAttribute("aria-invalid"),
    ).toBe("true")
  })
})
