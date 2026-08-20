import {
  COLOR_DIRECTIONS,
  PERSONALITY_TRAITS,
  TEMPLATE_IDS,
  TYPOGRAPHY_DIRECTIONS,
  VISUAL_DIRECTIONS,
  VOICE_TRAITS,
  type BlueprintDraft,
  type BlueprintSummary,
  type BrandAnswers,
  type BrandBlueprintConfig,
  type BrandBlueprintContent,
  type ColorDirection,
  type PersonalityTrait,
  type TemplateId,
  type TypographyDirection,
  type VisualDirection,
  type VoiceTrait,
} from "./types"

export type ValidationIssue = { path: string; message: string }
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; issues: ValidationIssue[] }

const LIMITS = {
  brandName: 80,
  offerAudience: 400,
  alwaysCommunicate: 240,
  avoid: 240,
  instruction: 500,
  content: 600,
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value)
}

function success<T>(data: T): ValidationResult<T> {
  return { success: true, data }
}

function failure<T>(issues: ValidationIssue[]): ValidationResult<T> {
  return { success: false, issues }
}

function readString(
  value: unknown,
  path: string,
  maxLength: number,
  issues: ValidationIssue[],
) {
  if (typeof value !== "string") {
    issues.push({ path, message: "Must be a string." })
    return ""
  }

  const normalized = value.trim()
  if (normalized.length > maxLength) {
    issues.push({ path, message: `Must be ${maxLength} characters or fewer.` })
  }
  return normalized
}

function readRequiredString(
  value: unknown,
  path: string,
  maxLength: number,
  issues: ValidationIssue[],
) {
  const normalized = readString(value, path, maxLength, issues)
  if (normalized.length === 0) issues.push({ path, message: "Cannot be blank." })
  return normalized
}

function readEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  issues: ValidationIssue[],
): T | null {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    issues.push({ path, message: "Must be a supported option." })
    return null
  }
  return value as T
}

function readNullableEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  issues: ValidationIssue[],
): T | null {
  return value === null ? null : readEnum(value, allowed, path, issues)
}

function readUniqueEnumArray<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  issues: ValidationIssue[],
) {
  if (!Array.isArray(value) || value.length > 3) {
    issues.push({ path, message: "Must contain between zero and three supported options." })
    return [] as T[]
  }

  const parsed = value.map((item, index) => readEnum(item, allowed, `${path}[${index}]`, issues))
  if (new Set(value).size !== value.length) {
    issues.push({ path, message: "Options must be unique." })
  }
  return parsed.filter((item): item is T => item !== null)
}

function rejectUnknownKeys(value: unknown, keys: readonly string[], path: string, issues: ValidationIssue[]) {
  if (!isRecord(value)) {
    issues.push({ path, message: "Must be an object." })
    return false
  }
  if (!hasOnlyKeys(value, keys)) {
    issues.push({ path, message: "Contains missing or unsupported fields." })
    return false
  }
  return true
}

function validateAnswers(value: unknown, issues: ValidationIssue[]): BrandAnswers | undefined {
  if (
    !rejectUnknownKeys(
      value,
      [
        "offerAudience",
        "personalityTraits",
        "visualDirection",
        "colorDirection",
        "typographyDirection",
        "voiceTraits",
        "alwaysCommunicate",
        "avoid",
      ],
      "answers",
      issues,
    ) ||
    !isRecord(value)
  ) {
    return undefined
  }

  return {
    offerAudience: readString(value.offerAudience, "answers.offerAudience", LIMITS.offerAudience, issues),
    personalityTraits: readUniqueEnumArray(
      value.personalityTraits,
      PERSONALITY_TRAITS,
      "answers.personalityTraits",
      issues,
    ) as PersonalityTrait[],
    visualDirection: readNullableEnum(
      value.visualDirection,
      VISUAL_DIRECTIONS,
      "answers.visualDirection",
      issues,
    ) as VisualDirection | null,
    colorDirection: readNullableEnum(
      value.colorDirection,
      COLOR_DIRECTIONS,
      "answers.colorDirection",
      issues,
    ) as ColorDirection | null,
    typographyDirection: readNullableEnum(
      value.typographyDirection,
      TYPOGRAPHY_DIRECTIONS,
      "answers.typographyDirection",
      issues,
    ) as TypographyDirection | null,
    voiceTraits: readUniqueEnumArray(
      value.voiceTraits,
      VOICE_TRAITS,
      "answers.voiceTraits",
      issues,
    ) as VoiceTrait[],
    alwaysCommunicate: readString(
      value.alwaysCommunicate,
      "answers.alwaysCommunicate",
      LIMITS.alwaysCommunicate,
      issues,
    ),
    avoid: readString(value.avoid, "answers.avoid", LIMITS.avoid, issues),
  }
}

function validateContent(value: unknown, issues: ValidationIssue[]): BrandBlueprintContent | undefined {
  if (
    !rejectUnknownKeys(
      value,
      ["essence", "audiencePromise", "personality", "visualDirection", "voiceTone", "guardrail"],
      "content",
      issues,
    ) ||
    !isRecord(value)
  ) {
    return undefined
  }

  const guardrail = value.guardrail
  if (guardrail !== null && typeof guardrail !== "string") {
    issues.push({ path: "content.guardrail", message: "Must be a string or null." })
  }

  return {
    essence: readString(value.essence, "content.essence", LIMITS.content, issues),
    audiencePromise: readString(
      value.audiencePromise,
      "content.audiencePromise",
      LIMITS.content,
      issues,
    ),
    personality: readString(value.personality, "content.personality", LIMITS.content, issues),
    visualDirection: readString(
      value.visualDirection,
      "content.visualDirection",
      LIMITS.content,
      issues,
    ),
    voiceTone: readString(value.voiceTone, "content.voiceTone", LIMITS.content, issues),
    guardrail:
      typeof guardrail === "string"
        ? readString(guardrail, "content.guardrail", LIMITS.content, issues)
        : null,
  }
}

export function validateBlueprintConfig(input: unknown): ValidationResult<BrandBlueprintConfig> {
  const issues: ValidationIssue[] = []
  if (
    !rejectUnknownKeys(input, ["schemaVersion", "answers", "content"], "config", issues) ||
    !isRecord(input)
  ) {
    return failure(issues)
  }
  if (input.schemaVersion !== 1) {
    issues.push({ path: "config.schemaVersion", message: "Must be schema version 1." })
  }

  const answers = validateAnswers(input.answers, issues)
  const content = validateContent(input.content, issues)
  if (issues.length > 0 || !answers || !content || input.schemaVersion !== 1) {
    return failure(issues)
  }
  return success({ schemaVersion: 1, answers, content })
}

function readNullableIsoDate(value: unknown, path: string, issues: ValidationIssue[]) {
  if (value === null) return null
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    issues.push({ path, message: "Must be an ISO date string or null." })
    return null
  }
  return value
}

export function validateBlueprintDraft(input: unknown): ValidationResult<BlueprintDraft> {
  const issues: ValidationIssue[] = []
  if (
    !rejectUnknownKeys(
      input,
      ["id", "brandName", "template", "config", "createdAt", "updatedAt"],
      "draft",
      issues,
    ) ||
    !isRecord(input)
  ) {
    return failure(issues)
  }
  const id = input.id === null ? null : input.id
  if (id !== null && (typeof id !== "number" || !Number.isInteger(id) || id <= 0)) {
    issues.push({ path: "draft.id", message: "Must be a positive integer or null." })
  }
  const template = readEnum(input.template, TEMPLATE_IDS, "draft.template", issues) as TemplateId | null
  const config = validateBlueprintConfig(input.config)
  if (!config.success) issues.push(...config.issues)
  const brandName = readRequiredString(input.brandName, "draft.brandName", LIMITS.brandName, issues)
  const createdAt = readNullableIsoDate(input.createdAt, "draft.createdAt", issues)
  const updatedAt = readNullableIsoDate(input.updatedAt, "draft.updatedAt", issues)

  if (
    issues.length > 0 ||
    !template ||
    !config.success ||
    (id !== null && (typeof id !== "number" || !Number.isInteger(id) || id <= 0))
  ) {
    return failure(issues)
  }
  return success({ id: id as number | null, brandName, template, config: config.data, createdAt, updatedAt })
}

export function validateBlueprintSummary(input: unknown): ValidationResult<BlueprintSummary> {
  const issues: ValidationIssue[] = []
  if (
    !rejectUnknownKeys(input, ["id", "brandName", "template", "updatedAt"], "summary", issues) ||
    !isRecord(input)
  ) {
    return failure(issues)
  }
  const template = readEnum(input.template, TEMPLATE_IDS, "summary.template", issues)
  const id = input.id
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
    issues.push({ path: "summary.id", message: "Must be a positive integer." })
  }
  const updatedAt = readNullableIsoDate(input.updatedAt, "summary.updatedAt", issues)
  if (updatedAt === null) issues.push({ path: "summary.updatedAt", message: "Cannot be null." })
  const brandName = readRequiredString(input.brandName, "summary.brandName", LIMITS.brandName, issues)

  if (!template || issues.length > 0 || typeof id !== "number" || !updatedAt) {
    return failure(issues)
  }
  return success({ id: id as number, brandName, template, updatedAt })
}

export function validateBlueprintInstruction(input: unknown): ValidationResult<string> {
  const issues: ValidationIssue[] = []
  const instruction = readRequiredString(input, "instruction", LIMITS.instruction, issues)
  return issues.length === 0 ? success(instruction) : failure(issues)
}

export function isBlueprintComplete(config: BrandBlueprintConfig) {
  const { answers } = config
  return (
    answers.offerAudience.trim().length > 0 &&
    answers.personalityTraits.length === 3 &&
    new Set(answers.personalityTraits).size === 3 &&
    answers.visualDirection !== null &&
    answers.colorDirection !== null &&
    answers.typographyDirection !== null &&
    answers.voiceTraits.length >= 1 &&
    answers.voiceTraits.length <= 3 &&
    new Set(answers.voiceTraits).size === answers.voiceTraits.length &&
    answers.alwaysCommunicate.trim().length > 0
  )
}

export function validateCompleteBlueprintDraft(input: unknown): ValidationResult<BlueprintDraft> {
  const draft = validateBlueprintDraft(input)
  if (!draft.success) return draft
  if (isBlueprintComplete(draft.data.config)) return draft
  return {
    success: false,
    issues: [{ path: "draft.config.answers", message: "Complete the required brand direction fields." }],
  }
}
