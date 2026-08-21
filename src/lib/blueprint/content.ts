import { createEmptyBlueprintConfig } from "./defaults"
import {
  COLOR_DIRECTION_OPTIONS,
  PERSONALITY_TRAIT_OPTIONS,
  TYPOGRAPHY_DIRECTION_OPTIONS,
  VISUAL_DIRECTION_OPTIONS,
  VOICE_TRAIT_OPTIONS,
  optionLabel,
} from "./options"
import type { BrandAnswers, BrandBlueprintConfig, BrandBlueprintContent } from "./types"

export const ANSWER_CONTENT_DEPENDENCIES: Record<
  keyof BrandAnswers,
  readonly (keyof BrandBlueprintContent)[]
> = {
  offerAudience: ["audiencePromise"],
  personalityTraits: ["essence", "personality"],
  visualDirection: ["essence", "visualDirection"],
  colorDirection: ["visualDirection"],
  typographyDirection: ["visualDirection"],
  voiceTraits: ["voiceTone"],
  alwaysCommunicate: ["audiencePromise", "voiceTone"],
  avoid: ["guardrail"],
}

function sentenceList(values: string[]) {
  if (values.length <= 1) return values[0] ?? ""
  if (values.length === 2) return values.join(" and ")
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`
}

function normalized(value: string) {
  return value.trim()
}

export function buildDeterministicContent(answers: BrandAnswers): BrandBlueprintContent {
  const personalityTraits = answers.personalityTraits.map((trait) =>
    optionLabel(PERSONALITY_TRAIT_OPTIONS, trait)!.toLowerCase(),
  )
  const voiceTraits = answers.voiceTraits.map((trait) =>
    optionLabel(VOICE_TRAIT_OPTIONS, trait)!.toLowerCase(),
  )
  const visual = optionLabel(VISUAL_DIRECTION_OPTIONS, answers.visualDirection)?.toLowerCase()
  const color = optionLabel(COLOR_DIRECTION_OPTIONS, answers.colorDirection)?.toLowerCase()
  const typography = optionLabel(
    TYPOGRAPHY_DIRECTION_OPTIONS,
    answers.typographyDirection,
  )?.toLowerCase()
  const offerAudience = normalized(answers.offerAudience)
  const alwaysCommunicate = normalized(answers.alwaysCommunicate)
  const avoid = normalized(answers.avoid)
  const visualParts = [
    visual,
    color && `${color}-leaning color`,
    typography && `${typography} typography`,
  ].filter((part): part is string => Boolean(part))

  return {
    essence:
      personalityTraits.length > 0 || visual
        ? `A ${sentenceList(personalityTraits) || "distinctive"}${visual ? `, ${visual}` : ""} salon brand expression.`
        : createEmptyBlueprintConfig().content.essence,
    audiencePromise: offerAudience
      ? `${offerAudience}${alwaysCommunicate ? `. Every touchpoint should communicate ${alwaysCommunicate}.` : "."}`
      : createEmptyBlueprintConfig().content.audiencePromise,
    personality:
      personalityTraits.length > 0
        ? `The salon brand feels ${sentenceList(personalityTraits)}.`
        : createEmptyBlueprintConfig().content.personality,
    visualDirection:
      visualParts.length > 0
        ? `A salon visual system with ${visualParts.join(" and ")}.`
        : createEmptyBlueprintConfig().content.visualDirection,
    voiceTone:
      voiceTraits.length > 0
        ? `Use a ${sentenceList(voiceTraits)} voice across booking, social, and client communication${alwaysCommunicate ? `, consistently reinforcing ${alwaysCommunicate}` : ""}.`
        : createEmptyBlueprintConfig().content.voiceTone,
    guardrail: avoid ? `Avoid ${avoid} in client-facing communication.` : null,
  }
}

export function applyManualAnswer<K extends keyof BrandAnswers>(
  config: BrandBlueprintConfig,
  field: K,
  value: BrandAnswers[K],
): BrandBlueprintConfig {
  const answers = {
    ...config.answers,
    personalityTraits: [...config.answers.personalityTraits],
    voiceTraits: [...config.answers.voiceTraits],
    [field]: Array.isArray(value) ? [...value] : value,
  } as BrandAnswers
  const deterministicContent = buildDeterministicContent(answers)
  const content = { ...config.content }

  for (const section of ANSWER_CONTENT_DEPENDENCIES[field]) {
    if (section === "guardrail") {
      content.guardrail = deterministicContent.guardrail
    } else {
      content[section] = deterministicContent[section]
    }
  }

  return {
    ...config,
    answers,
    content,
  }
}
