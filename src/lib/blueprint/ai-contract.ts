import { applyManualAnswer } from "./content"
import {
  COLOR_DIRECTIONS,
  PERSONALITY_TRAITS,
  TYPOGRAPHY_DIRECTIONS,
  VISUAL_DIRECTIONS,
  VOICE_TRAITS,
  type BlueprintDraft,
  type BrandBlueprintContent,
  type ColorDirection,
  type PersonalityTrait,
  type TypographyDirection,
  type VisualDirection,
  type VoiceTrait,
} from "./types"
import {
  validateCompleteBlueprintDraft,
  type ValidationIssue,
  type ValidationResult,
} from "./validation"

export type AiBlueprintPatch = {
  answers: {
    personalityTraits: PersonalityTrait[] | null
    visualDirection: VisualDirection | null
    colorDirection: ColorDirection | null
    typographyDirection: TypographyDirection | null
    voiceTraits: VoiceTrait[] | null
    alwaysCommunicate: string | null
    avoid: string | null
  }
  content: {
    essence: string | null
    audiencePromise: string | null
    personality: string | null
    visualDirection: string | null
    voiceTone: string | null
    guardrail: string | null
  }
  changeSummary: string
}

export const AI_REFINEMENT_TARGETS = [
  "voice",
  "personality",
  "visual",
  "color",
  "typography",
  "copy",
] as const

export type AiRefinementTarget = (typeof AI_REFINEMENT_TARGETS)[number]

const ANSWER_KEYS = [
  "personalityTraits",
  "visualDirection",
  "colorDirection",
  "typographyDirection",
  "voiceTraits",
  "alwaysCommunicate",
  "avoid",
] as const
const CONTENT_KEYS = [
  "essence",
  "audiencePromise",
  "personality",
  "visualDirection",
  "voiceTone",
  "guardrail",
] as const

export const AI_REFINEMENT_TARGET_SCOPES = {
  voice: {
    answers: ["voiceTraits", "alwaysCommunicate", "avoid"],
    content: ["audiencePromise", "voiceTone", "guardrail"],
  },
  personality: {
    answers: ["personalityTraits"],
    content: ["essence", "personality"],
  },
  visual: {
    answers: ["visualDirection"],
    content: ["essence", "visualDirection"],
  },
  color: {
    answers: ["colorDirection"],
    content: ["visualDirection"],
  },
  typography: {
    answers: ["typographyDirection"],
    content: ["visualDirection"],
  },
  copy: {
    answers: [],
    content: [...CONTENT_KEYS],
  },
} as const satisfies Record<
  AiRefinementTarget,
  {
    answers: readonly (typeof ANSWER_KEYS)[number][]
    content: readonly (typeof CONTENT_KEYS)[number][]
  }
>

export const AI_BLUEPRINT_PATCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["answers", "content", "changeSummary"],
  properties: {
    answers: {
      type: "object",
      additionalProperties: false,
      required: [...ANSWER_KEYS],
      properties: {
        personalityTraits: {
          anyOf: [
            {
              type: "array",
              items: { type: "string", enum: [...PERSONALITY_TRAITS] },
              minItems: 3,
              maxItems: 3,
            },
            { type: "null" },
          ],
        },
        visualDirection: {
          anyOf: [
            { type: "string", enum: [...VISUAL_DIRECTIONS] },
            { type: "null" },
          ],
        },
        colorDirection: {
          anyOf: [
            { type: "string", enum: [...COLOR_DIRECTIONS] },
            { type: "null" },
          ],
        },
        typographyDirection: {
          anyOf: [
            { type: "string", enum: [...TYPOGRAPHY_DIRECTIONS] },
            { type: "null" },
          ],
        },
        voiceTraits: {
          anyOf: [
            {
              type: "array",
              items: { type: "string", enum: [...VOICE_TRAITS] },
              minItems: 1,
              maxItems: 3,
            },
            { type: "null" },
          ],
        },
        alwaysCommunicate: {
          anyOf: [
            { type: "string", minLength: 1, maxLength: 240 },
            { type: "null" },
          ],
        },
        avoid: {
          anyOf: [{ type: "string", maxLength: 240 }, { type: "null" }],
        },
      },
    },
    content: {
      type: "object",
      additionalProperties: false,
      required: [...CONTENT_KEYS],
      properties: Object.fromEntries(
        CONTENT_KEYS.map((key) => [
          key,
          {
            anyOf: [
              { type: "string", minLength: 1, maxLength: 600 },
              { type: "null" },
            ],
          },
        ]),
      ),
    },
    changeSummary: { type: "string", minLength: 1, maxLength: 240 },
  },
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actual = Object.keys(value)
  return actual.length === keys.length && actual.every((key) => keys.includes(key))
}

function readNullableEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  issues: ValidationIssue[],
): T | null {
  if (value === null) return null
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    issues.push({ path, message: "Must be null or a supported option." })
    return null
  }
  return value as T
}

function readNullableEnumArray<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  min: number,
  max: number,
  issues: ValidationIssue[],
): T[] | null {
  if (value === null) return null
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    issues.push({ path, message: `Must be null or contain between ${min} and ${max} options.` })
    return null
  }
  const parsed = value.filter(
    (item): item is T => typeof item === "string" && allowed.includes(item as T),
  )
  if (parsed.length !== value.length) {
    issues.push({ path, message: "Contains an unsupported option." })
  }
  if (new Set(value).size !== value.length) {
    issues.push({ path, message: "Options must be unique." })
  }
  return parsed
}

function readNullableString(
  value: unknown,
  path: string,
  maxLength: number,
  allowBlank: boolean,
  issues: ValidationIssue[],
) {
  if (value === null) return null
  if (typeof value !== "string") {
    issues.push({ path, message: "Must be a string or null." })
    return null
  }
  const normalized = value.trim()
  if (!allowBlank && normalized.length === 0) {
    issues.push({ path, message: "Cannot be blank." })
  }
  if (normalized.length > maxLength) {
    issues.push({ path, message: `Must be ${maxLength} characters or fewer.` })
  }
  return normalized
}

export function validateAiBlueprintPatch(input: unknown): ValidationResult<AiBlueprintPatch> {
  const issues: ValidationIssue[] = []
  if (!isRecord(input) || !hasExactKeys(input, ["answers", "content", "changeSummary"])) {
    return {
      success: false,
      issues: [{ path: "patch", message: "Contains missing or unsupported fields." }],
    }
  }
  if (!isRecord(input.answers) || !hasExactKeys(input.answers, ANSWER_KEYS)) {
    issues.push({ path: "patch.answers", message: "Contains missing or unsupported fields." })
  }
  if (!isRecord(input.content) || !hasExactKeys(input.content, CONTENT_KEYS)) {
    issues.push({ path: "patch.content", message: "Contains missing or unsupported fields." })
  }
  if (issues.length > 0 || !isRecord(input.answers) || !isRecord(input.content)) {
    return { success: false, issues }
  }
  const rawContent = input.content

  const answers = {
    personalityTraits: readNullableEnumArray(
      input.answers.personalityTraits,
      PERSONALITY_TRAITS,
      "patch.answers.personalityTraits",
      3,
      3,
      issues,
    ) as PersonalityTrait[] | null,
    visualDirection: readNullableEnum(
      input.answers.visualDirection,
      VISUAL_DIRECTIONS,
      "patch.answers.visualDirection",
      issues,
    ) as VisualDirection | null,
    colorDirection: readNullableEnum(
      input.answers.colorDirection,
      COLOR_DIRECTIONS,
      "patch.answers.colorDirection",
      issues,
    ) as ColorDirection | null,
    typographyDirection: readNullableEnum(
      input.answers.typographyDirection,
      TYPOGRAPHY_DIRECTIONS,
      "patch.answers.typographyDirection",
      issues,
    ) as TypographyDirection | null,
    voiceTraits: readNullableEnumArray(
      input.answers.voiceTraits,
      VOICE_TRAITS,
      "patch.answers.voiceTraits",
      1,
      3,
      issues,
    ) as VoiceTrait[] | null,
    alwaysCommunicate: readNullableString(
      input.answers.alwaysCommunicate,
      "patch.answers.alwaysCommunicate",
      240,
      false,
      issues,
    ),
    avoid: readNullableString(
      input.answers.avoid,
      "patch.answers.avoid",
      240,
      true,
      issues,
    ),
  }

  const content = Object.fromEntries(
    CONTENT_KEYS.map((key) => [
      key,
      readNullableString(rawContent[key], `patch.content.${key}`, 600, false, issues),
    ]),
  ) as AiBlueprintPatch["content"]
  const changeSummary = readNullableString(
    input.changeSummary,
    "patch.changeSummary",
    240,
    false,
    issues,
  )

  if (issues.length > 0 || changeSummary === null) return { success: false, issues }
  return { success: true, data: { answers, content, changeSummary } }
}

export function validateAiRefinementTarget(input: unknown): ValidationResult<AiRefinementTarget> {
  return typeof input === "string" && AI_REFINEMENT_TARGETS.includes(input as AiRefinementTarget)
    ? { success: true, data: input as AiRefinementTarget }
    : {
        success: false,
        issues: [{ path: "target", message: "Choose a supported refinement target." }],
      }
}

export function validateAiBlueprintPatchScope(
  patch: AiBlueprintPatch,
  target: AiRefinementTarget,
): ValidationResult<AiBlueprintPatch> {
  const scope = AI_REFINEMENT_TARGET_SCOPES[target]
  const issues: ValidationIssue[] = []

  for (const key of ANSWER_KEYS) {
    if (patch.answers[key] !== null && !scope.answers.includes(key as never)) {
      issues.push({
        path: `patch.answers.${key}`,
        message: `Cannot change this field for the ${target} refinement target.`,
      })
    }
  }
  for (const key of CONTENT_KEYS) {
    if (patch.content[key] !== null && !scope.content.includes(key as never)) {
      issues.push({
        path: `patch.content.${key}`,
        message: `Cannot change this field for the ${target} refinement target.`,
      })
    }
  }

  return issues.length > 0 ? { success: false, issues } : { success: true, data: patch }
}

export function applyAiPatch(
  draft: BlueprintDraft,
  patch: AiBlueprintPatch,
): ValidationResult<BlueprintDraft> {
  let config = draft.config

  for (const field of ANSWER_KEYS) {
    const value = patch.answers[field]
    if (value !== null) config = applyManualAnswer(config, field, value as never)
  }

  const content = { ...config.content }
  for (const field of CONTENT_KEYS) {
    const value = patch.content[field]
    if (value !== null) content[field] = value as never
  }

  return validateCompleteBlueprintDraft({
    ...draft,
    config: { ...config, content: content as BrandBlueprintContent },
  })
}
