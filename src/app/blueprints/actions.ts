"use server"

import { revalidatePath } from "next/cache"

import { insertBlueprint, updateBlueprint } from "@/db/blueprints"
import type { BlueprintDraft } from "@/lib/blueprint/types"
import { validateBlueprintDraft, type ValidationIssue } from "@/lib/blueprint/validation"

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false
      code: "VALIDATION_ERROR" | "NOT_FOUND"
      message: string
      issues?: ValidationIssue[]
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
