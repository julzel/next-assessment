import { beforeEach, describe, expect, it, vi } from "vitest"

import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { AiBlueprintPatch } from "@/lib/blueprint/ai-contract"
import type { BlueprintDraft, BrandAnswers } from "@/lib/blueprint/types"

const repository = vi.hoisted(() => ({
  insertBlueprint: vi.fn(),
  updateBlueprint: vi.fn(),
}))
const cache = vi.hoisted(() => ({ revalidatePath: vi.fn() }))
const ai = vi.hoisted(() => ({
  isOpenAIConfigured: vi.fn(),
  isOpenAIRateLimitError: vi.fn(),
  requestBlueprintRefinement: vi.fn(),
}))

vi.mock("@/db/blueprints", () => repository)
vi.mock("next/cache", () => cache)
vi.mock("@/lib/openai", () => ai)

import { refineBlueprint, saveBlueprint } from "./actions"

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
  alwaysCommunicate: "Thoughtful expertise and care",
  avoid: "Pressure or beauty stereotypes",
}
const completeDraft: BlueprintDraft = {
  ...draft,
  config: {
    schemaVersion: 1,
    answers: completeAnswers,
    content: buildDeterministicContent(completeAnswers),
  },
}
const patch: AiBlueprintPatch = {
  answers: {
    personalityTraits: null,
    visualDirection: null,
    colorDirection: null,
    typographyDirection: null,
    voiceTraits: ["warm", "playful"],
    alwaysCommunicate: null,
    avoid: null,
  },
  content: {
    essence: null,
    audiencePromise: null,
    personality: null,
    visualDirection: null,
    voiceTone: "Use a warm and playful voice while keeping appointment details clear.",
    guardrail: null,
  },
  changeSummary: "Made the salon voice warmer and more playful.",
}

describe("saveBlueprint", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ai.isOpenAIConfigured.mockReturnValue(true)
    ai.isOpenAIRateLimitError.mockReturnValue(false)
  })

  it("rejects invalid drafts before touching the repository", async () => {
    const result = await saveBlueprint({ ...draft, brandName: " " })

    expect(result).toMatchObject({ ok: false, code: "VALIDATION_ERROR" })
    expect(repository.insertBlueprint).not.toHaveBeenCalled()
  })

  it("returns not found when an existing blueprint cannot be updated", async () => {
    repository.updateBlueprint.mockReturnValue(null)

    const result = await saveBlueprint({
      ...draft,
      id: 99,
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z",
    })

    expect(result).toMatchObject({ ok: false, code: "NOT_FOUND" })
  })

  it("inserts valid drafts and returns the canonical saved DTO", async () => {
    const saved = {
      ...draft,
      id: 4,
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-20T12:00:00.000Z",
    }
    repository.insertBlueprint.mockReturnValue(saved)

    await expect(saveBlueprint(draft)).resolves.toEqual({ ok: true, data: saved })
    expect(repository.insertBlueprint).toHaveBeenCalledWith({
      brandName: draft.brandName,
      template: draft.template,
      config: draft.config,
    })
    expect(cache.revalidatePath).toHaveBeenCalledWith("/")
  })
})

describe("refineBlueprint", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ai.isOpenAIConfigured.mockReturnValue(true)
    ai.isOpenAIRateLimitError.mockReturnValue(false)
  })

  it("rejects incomplete drafts and blank instructions before an API request", async () => {
    await expect(refineBlueprint({ draft, instruction: "make it warm", target: "voice" })).resolves.toMatchObject({
      ok: false,
      code: "VALIDATION_ERROR",
    })
    await expect(
      refineBlueprint({ draft: completeDraft, instruction: " ", target: "voice" }),
    ).resolves.toMatchObject({ ok: false, code: "VALIDATION_ERROR" })
    expect(ai.requestBlueprintRefinement).not.toHaveBeenCalled()
  })

  it("returns unavailable before a client call when the API key is missing", async () => {
    ai.isOpenAIConfigured.mockReturnValue(false)

    await expect(
      refineBlueprint({ draft: completeDraft, instruction: "make it warmer", target: "voice" }),
    ).resolves.toMatchObject({ ok: false, code: "AI_UNAVAILABLE" })
    expect(ai.requestBlueprintRefinement).not.toHaveBeenCalled()
  })

  it("returns a validated unsaved draft without invoking persistence", async () => {
    ai.requestBlueprintRefinement.mockResolvedValue({
      status: "completed",
      output: [],
      output_text: JSON.stringify(patch),
    })

    const result = await refineBlueprint({
      draft: completeDraft,
      instruction: "make the voice warmer",
      target: "voice",
    })

    expect(result).toMatchObject({
      ok: true,
      data: {
        draft: {
          id: completeDraft.id,
          brandName: completeDraft.brandName,
          template: completeDraft.template,
          config: { answers: { offerAudience: completeAnswers.offerAudience } },
        },
        changeSummary: patch.changeSummary,
      },
    })
    expect(repository.insertBlueprint).not.toHaveBeenCalled()
    expect(repository.updateBlueprint).not.toHaveBeenCalled()
    expect(cache.revalidatePath).not.toHaveBeenCalled()
    expect(ai.requestBlueprintRefinement).toHaveBeenCalledWith({
      draft: completeDraft,
      instruction: "make the voice warmer",
      target: "voice",
    })
  })

  it("rejects a structurally valid patch that changes fields outside the selected target", async () => {
    ai.requestBlueprintRefinement.mockResolvedValue({
      status: "completed",
      output: [],
      output_text: JSON.stringify({
        ...patch,
        answers: { ...patch.answers, colorDirection: "warm" },
      }),
    })

    await expect(
      refineBlueprint({
        draft: completeDraft,
        instruction: "make only the voice warmer",
        target: "voice",
      }),
    ).resolves.toMatchObject({
      ok: false,
      code: "AI_INVALID_RESPONSE",
      message: expect.stringContaining("outside the selected refinement target"),
    })
    expect(repository.insertBlueprint).not.toHaveBeenCalled()
    expect(repository.updateBlueprint).not.toHaveBeenCalled()
  })

  it("rejects a missing or unsupported refinement target before an API request", async () => {
    await expect(
      refineBlueprint({ draft: completeDraft, instruction: "make it warmer", target: "database" }),
    ).resolves.toMatchObject({ ok: false, code: "VALIDATION_ERROR" })
    expect(ai.requestBlueprintRefinement).not.toHaveBeenCalled()
  })

  it.each([
    ["malformed JSON", "not json"],
    ["unknown key", JSON.stringify({ ...patch, arbitraryHtml: "<script />" })],
    [
      "invalid enum",
      JSON.stringify({
        ...patch,
        answers: { ...patch.answers, visualDirection: "cinematic" },
      }),
    ],
    [
      "oversized copy",
      JSON.stringify({
        ...patch,
        content: { ...patch.content, essence: "x".repeat(601) },
      }),
    ],
  ])("rejects %s output without changing or saving the draft", async (_label, outputText) => {
    ai.requestBlueprintRefinement.mockResolvedValue({
      status: "completed",
      output: [],
      output_text: outputText,
    })

    await expect(
      refineBlueprint({ draft: completeDraft, instruction: "change the direction", target: "voice" }),
    ).resolves.toMatchObject({ ok: false, code: "AI_INVALID_RESPONSE" })
    expect(repository.insertBlueprint).not.toHaveBeenCalled()
    expect(repository.updateBlueprint).not.toHaveBeenCalled()
  })

  it("maps refusal, rate limit, and API failures to stable safe errors", async () => {
    ai.requestBlueprintRefinement.mockResolvedValueOnce({
      status: "completed",
      output_text: "",
      output: [
        {
          type: "message",
          content: [{ type: "refusal", refusal: "No" }],
        },
      ],
    })
    await expect(
      refineBlueprint({ draft: completeDraft, instruction: "change it", target: "voice" }),
    ).resolves.toMatchObject({ ok: false, code: "AI_REFUSED" })

    ai.isOpenAIRateLimitError.mockReturnValueOnce(true)
    ai.requestBlueprintRefinement.mockRejectedValueOnce(new Error("rate limited"))
    await expect(
      refineBlueprint({ draft: completeDraft, instruction: "change it", target: "voice" }),
    ).resolves.toMatchObject({ ok: false, code: "AI_RATE_LIMITED" })

    ai.requestBlueprintRefinement.mockRejectedValueOnce(new Error("network"))
    await expect(
      refineBlueprint({ draft: completeDraft, instruction: "change it", target: "voice" }),
    ).resolves.toMatchObject({ ok: false, code: "AI_FAILED" })
  })
})
