import { describe, expect, it } from "vitest"

import { buildDeterministicContent } from "./content"
import { createEmptyBlueprintConfig } from "./defaults"
import { createBrandApplicationViewModel } from "./applications"
import { resolveBlueprintPresentation } from "./presentation"
import type { BrandAnswers, BlueprintDraft } from "./types"

const answers: BrandAnswers = {
  offerAudience: "Dimensional color and restorative care for clients who value consultation",
  personalityTraits: ["refined", "precise"],
  visualDirection: "elegant",
  colorDirection: "neutral",
  typographyDirection: "editorial-serif",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "care begins with listening",
  avoid: "unsupported transformation claims",
}

function createDraft(overrides: Partial<BlueprintDraft> = {}): BlueprintDraft {
  return {
    id: 12,
    brandName: "Northstar Salon",
    template: "editorial",
    config: {
      schemaVersion: 1,
      answers,
      content: buildDeterministicContent(answers),
    },
    createdAt: "2026-08-20T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z",
    ...overrides,
  }
}

describe("createBrandApplicationViewModel", () => {
  it("derives serializable channel proofs from the canonical draft and presentation profile", () => {
    const draft = createDraft()
    const viewModel = createBrandApplicationViewModel(
      draft,
      resolveBlueprintPresentation(draft),
    )

    expect(viewModel).toMatchObject({
      brandName: "Northstar Salon",
      isPartial: false,
      sharedSystem: {
        palette: "neutral",
        typography: "editorial-serif",
        geometry: "elegant",
        personality: ["Refined", "Precise"],
        voice: ["Clear", "Thoughtful"],
      },
    })
    expect(viewModel.website.clientPromise).toContain(answers.offerAudience)
    expect(viewModel.social.foundationContext).toBe(answers.offerAudience)
    expect(viewModel.print.serviceContext).toBe(answers.offerAudience)
    expect(viewModel.print.clientMessage).toBe(answers.alwaysCommunicate)
    expect(JSON.parse(JSON.stringify(viewModel))).toEqual(viewModel)
  })

  it("reproduces identical proofs after a serialized save and reopen", () => {
    const draft = createDraft()
    const reopened = JSON.parse(JSON.stringify(draft)) as BlueprintDraft

    expect(
      createBrandApplicationViewModel(draft, resolveBlueprintPresentation(draft)),
    ).toEqual(
      createBrandApplicationViewModel(reopened, resolveBlueprintPresentation(reopened)),
    )
  })

  it("exposes changed visual-system metadata without creating channel-specific systems", () => {
    const draft = createDraft()
    const changedAnswers: BrandAnswers = {
      ...answers,
      visualDirection: "playful",
      colorDirection: "vibrant",
      typographyDirection: "modern-sans",
    }
    const changedDraft = createDraft({
      config: {
        schemaVersion: 1,
        answers: changedAnswers,
        content: buildDeterministicContent(changedAnswers),
      },
    })

    const initial = createBrandApplicationViewModel(draft, resolveBlueprintPresentation(draft))
    const changed = createBrandApplicationViewModel(
      changedDraft,
      resolveBlueprintPresentation(changedDraft),
    )

    expect(changed.sharedSystem).toMatchObject({
      palette: "vibrant",
      typography: "modern-sans",
      geometry: "playful",
    })
    expect(changed.sharedSystem).not.toEqual(initial.sharedSystem)
    expect(changed.website.action).toBe(initial.website.action)
    expect(changed.social.message).toBe(initial.social.message)
  })

  it("uses labeled neutral examples for a partial draft without inventing salon facts", () => {
    const draft = createDraft({
      brandName: "",
      config: createEmptyBlueprintConfig(),
    })
    const viewModel = createBrandApplicationViewModel(
      draft,
      resolveBlueprintPresentation(draft),
    )

    expect(viewModel.isPartial).toBe(true)
    expect(viewModel.brandName).toBe("Your salon name")
    expect(viewModel.social.messageLabel).toBe("Example campaign line")
    expect(viewModel.print.label).toContain("not print-ready")
    expect(viewModel.print.serviceContext).toMatch(/^Example service context/)
    expect(viewModel.print.clientMessage).toMatch(/^Example client message/)
    expect(JSON.stringify(viewModel)).not.toMatch(/price|award|certified|years of experience/i)
  })
})
