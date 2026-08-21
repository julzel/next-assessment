"use server"

import { revalidatePath } from "next/cache"

import { insertBlueprint, updateBlueprint } from "@/db/blueprints"
import { applyAiPatch, validateAiBlueprintPatch } from "@/lib/blueprint/ai-contract"
import type { BlueprintDraft } from "@/lib/blueprint/types"
import {
  validateBlueprintDraft,
  validateBlueprintInstruction,
  validateCompleteBlueprintDraft,
  type ValidationIssue,
} from "@/lib/blueprint/validation"
import {
  isOpenAIConfigured,
  isOpenAIRateLimitError,
  requestBlueprintRefinement,
} from "@/lib/openai"

export type ActionErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "AI_UNAVAILABLE"
  | "AI_RATE_LIMITED"
  | "AI_REFUSED"
  | "AI_INVALID_RESPONSE"
  | "AI_FAILED"

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false
      code: ActionErrorCode
      message: string
      issues?: ValidationIssue[]
    }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasRefusal(output: unknown) {
  if (!Array.isArray(output)) return false
  return output.some(
    (item) =>
      isRecord(item) &&
      item.type === "message" &&
      Array.isArray(item.content) &&
      item.content.some((content) => isRecord(content) && content.type === "refusal"),
  )
}

export async function saveBlueprint(input: BlueprintDraft): Promise<ActionResult<BlueprintDraft>> {
  const validation = validateBlueprintDraft(input)
  if (!validation.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Check the highlighted blueprint details and try again.",
      issues: validation.issues,
    }
  }

  const { id, brandName, template, config } = validation.data
  const saved =
    id === null
      ? insertBlueprint({ brandName, template, config })
      : updateBlueprint(id, { brandName, template, config })

  if (!saved) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "This blueprint no longer exists. Return to the library and try again.",
    }
  }

  revalidatePath("/")
  revalidatePath(`/blueprints/${saved.id}`)
  return { ok: true, data: saved }
}

export async function refineBlueprint(input: {
  draft: unknown
  instruction: unknown
}): Promise<ActionResult<{ draft: BlueprintDraft; changeSummary: string }>> {
  if (
    !isRecord(input) ||
    Object.keys(input).length !== 2 ||
    !("draft" in input) ||
    !("instruction" in input)
  ) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Provide a complete blueprint and a refinement instruction.",
    }
  }

  const draft = validateCompleteBlueprintDraft(input.draft)
  const instruction = validateBlueprintInstruction(input.instruction)
  if (!draft.success || !instruction.success) {
    const draftIsValid = draft.success
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: draftIsValid
        ? "Describe the salon brand change you want in 500 characters or fewer."
        : "Complete the salon brand direction before requesting an AI edit.",
      issues: !draft.success ? draft.issues : !instruction.success ? instruction.issues : [],
    }
  }

  if (!isOpenAIConfigured()) {
    return {
      ok: false,
      code: "AI_UNAVAILABLE",
      message: "AI refinement is not configured. Add OPENAI_API_KEY and try again.",
    }
  }

  try {
    const response = await requestBlueprintRefinement({
      draft: draft.data,
      instruction: instruction.data,
    })

    if (hasRefusal(response.output)) {
      return {
        ok: false,
        code: "AI_REFUSED",
        message: "The requested edit could not be applied. Try a different brand-direction request.",
      }
    }
    if (response.status === "failed") {
      return {
        ok: false,
        code: "AI_FAILED",
        message: "AI refinement failed before making any changes. Please try again.",
      }
    }
    if (response.status !== "completed" || !response.output_text.trim()) {
      return {
        ok: false,
        code: "AI_INVALID_RESPONSE",
        message: "AI returned an incomplete edit. No changes were applied.",
      }
    }

    let rawPatch: unknown
    try {
      rawPatch = JSON.parse(response.output_text)
    } catch {
      return {
        ok: false,
        code: "AI_INVALID_RESPONSE",
        message: "AI returned an unreadable edit. No changes were applied.",
      }
    }

    const patch = validateAiBlueprintPatch(rawPatch)
    if (!patch.success) {
      return {
        ok: false,
        code: "AI_INVALID_RESPONSE",
        message: "AI returned an unsupported edit. No changes were applied.",
      }
    }
    const merged = applyAiPatch(draft.data, patch.data)
    if (!merged.success) {
      return {
        ok: false,
        code: "AI_INVALID_RESPONSE",
        message: "AI returned an invalid blueprint update. No changes were applied.",
      }
    }

    return {
      ok: true,
      data: { draft: merged.data, changeSummary: patch.data.changeSummary },
    }
  } catch (error) {
    if (isOpenAIRateLimitError(error)) {
      return {
        ok: false,
        code: "AI_RATE_LIMITED",
        message: "AI refinement is busy right now. Wait a moment and try again.",
      }
    }
    console.error("Blueprint AI refinement failed", error instanceof Error ? error.name : "Unknown error")
    return {
      ok: false,
      code: "AI_FAILED",
      message: "AI refinement is temporarily unavailable. Your blueprint was not changed.",
    }
  }
}
