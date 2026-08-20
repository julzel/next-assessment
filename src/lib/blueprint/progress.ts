import type { BrandAnswers, BrandBlueprintConfig } from "./types"

export const BLUEPRINT_STEP_IDS = ["foundation", "personality", "visual", "voice"] as const

export type BlueprintStepId = (typeof BLUEPRINT_STEP_IDS)[number]
export type BlueprintStepStatus = "not-started" | "in-progress" | "complete"
export type BlueprintRequiredField =
  | "offerAudience"
  | "personalityTraits"
  | "visualDirection"
  | "colorDirection"
  | "typographyDirection"
  | "voiceTraits"
  | "alwaysCommunicate"
export type BlueprintFieldKey = "brandName" | keyof BrandAnswers
export type BlueprintFieldErrors = Partial<Record<BlueprintFieldKey, string>>

export type BlueprintMissingRequirement = {
  field: BlueprintRequiredField
  step: BlueprintStepId
  message: string
  focusId: string
}

export type BlueprintStepProgress = {
  id: BlueprintStepId
  title: string
  description: string
  purpose: string
  impact: string
  status: BlueprintStepStatus
  missing: BlueprintMissingRequirement[]
}

export const BLUEPRINT_STEP_DEFINITIONS = [
  {
    id: "foundation",
    title: "Foundation",
    description: "Audience and offer",
    purpose: "Clarify who the brand serves and the value it promises to deliver.",
    impact: "Updates the audience and promise area of the Blueprint.",
  },
  {
    id: "personality",
    title: "Personality",
    description: "Traits and visual direction",
    purpose: "Define how the brand should feel before choosing its visual system.",
    impact: "Updates the brand essence, personality summary, and visual emphasis.",
  },
  {
    id: "visual",
    title: "Visual system",
    description: "Color and typography",
    purpose: "Choose the palette and type character that make the direction recognizable.",
    impact: "Updates the visual direction now and will style the full Blueprint presentation.",
  },
  {
    id: "voice",
    title: "Voice",
    description: "Tone and guardrails",
    purpose: "Set how the brand should sound and the communication boundary it should respect.",
    impact: "Updates the voice, recurring message, and optional guardrail areas.",
  },
] as const satisfies readonly Omit<BlueprintStepProgress, "status" | "missing">[]

export const BLUEPRINT_REQUIRED_FIELDS: readonly BlueprintRequiredField[] = [
  "offerAudience",
  "personalityTraits",
  "visualDirection",
  "colorDirection",
  "typographyDirection",
  "voiceTraits",
  "alwaysCommunicate",
]

function missingRequirements(answers: BrandAnswers): BlueprintMissingRequirement[] {
  const missing: BlueprintMissingRequirement[] = []

  if (answers.offerAudience.trim().length === 0) {
    missing.push({
      field: "offerAudience",
      step: "foundation",
      message: "Describe what the brand offers and who it serves.",
      focusId: "offer-audience",
    })
  }
  if (
    answers.personalityTraits.length !== 3 ||
    new Set(answers.personalityTraits).size !== 3
  ) {
    const remaining = Math.max(0, 3 - new Set(answers.personalityTraits).size)
    missing.push({
      field: "personalityTraits",
      step: "personality",
      message:
        remaining > 0
          ? `Choose ${remaining} more personality trait${remaining === 1 ? "" : "s"}.`
          : "Choose three different personality traits.",
      focusId: "personality-traits",
    })
  }
  if (answers.visualDirection === null) {
    missing.push({
      field: "visualDirection",
      step: "personality",
      message: "Choose one visual direction.",
      focusId: "visual-direction",
    })
  }
  if (answers.colorDirection === null) {
    missing.push({
      field: "colorDirection",
      step: "visual",
      message: "Choose one color direction.",
      focusId: "color-direction",
    })
  }
  if (answers.typographyDirection === null) {
    missing.push({
      field: "typographyDirection",
      step: "visual",
      message: "Choose one typography direction.",
      focusId: "typography-direction",
    })
  }
  if (
    answers.voiceTraits.length < 1 ||
    answers.voiceTraits.length > 3 ||
    new Set(answers.voiceTraits).size !== answers.voiceTraits.length
  ) {
    missing.push({
      field: "voiceTraits",
      step: "voice",
      message: "Choose between one and three different voice traits.",
      focusId: "voice-traits",
    })
  }
  if (answers.alwaysCommunicate.trim().length === 0) {
    missing.push({
      field: "alwaysCommunicate",
      step: "voice",
      message: "Describe what the brand should always communicate.",
      focusId: "always-communicate",
    })
  }

  return missing
}

function hasStarted(step: BlueprintStepId, answers: BrandAnswers) {
  switch (step) {
    case "foundation":
      return answers.offerAudience.trim().length > 0
    case "personality":
      return answers.personalityTraits.length > 0 || answers.visualDirection !== null
    case "visual":
      return answers.colorDirection !== null || answers.typographyDirection !== null
    case "voice":
      return (
        answers.voiceTraits.length > 0 ||
        answers.alwaysCommunicate.trim().length > 0 ||
        answers.avoid.trim().length > 0
      )
  }
}

export function getBlueprintProgress(answers: BrandAnswers) {
  const missing = missingRequirements(answers)
  const steps: BlueprintStepProgress[] = BLUEPRINT_STEP_DEFINITIONS.map((definition) => {
    const stepMissing = missing.filter((requirement) => requirement.step === definition.id)
    return {
      ...definition,
      status:
        stepMissing.length === 0
          ? "complete"
          : hasStarted(definition.id, answers)
            ? "in-progress"
            : "not-started",
      missing: stepMissing,
    }
  })

  return {
    steps,
    completedCount: steps.filter((step) => step.status === "complete").length,
    isComplete: missing.length === 0,
    missing,
    firstIncompleteStep: steps.find((step) => step.status !== "complete")?.id ?? null,
  }
}

export function isBlueprintComplete(config: BrandBlueprintConfig) {
  return getBlueprintProgress(config.answers).isComplete
}

const FIELD_PATHS: Record<BlueprintFieldKey, string> = {
  brandName: "draft.brandName",
  offerAudience: "answers.offerAudience",
  personalityTraits: "answers.personalityTraits",
  visualDirection: "answers.visualDirection",
  colorDirection: "answers.colorDirection",
  typographyDirection: "answers.typographyDirection",
  voiceTraits: "answers.voiceTraits",
  alwaysCommunicate: "answers.alwaysCommunicate",
  avoid: "answers.avoid",
}

export function getBlueprintFieldErrors(
  issues: readonly { path: string; message: string }[],
): BlueprintFieldErrors {
  const errors: BlueprintFieldErrors = {}

  for (const [field, path] of Object.entries(FIELD_PATHS) as [BlueprintFieldKey, string][]) {
    const issue = issues.find(
      (candidate) => candidate.path === path || candidate.path.startsWith(`${path}[`),
    )
    if (issue) errors[field] = issue.message
  }

  return errors
}
