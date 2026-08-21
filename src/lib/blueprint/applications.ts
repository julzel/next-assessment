import type { BlueprintPresentationProfile } from "./presentation"
import type { BlueprintDraft } from "./types"

export type BrandApplicationViewModel = {
  brandName: string
  isPartial: boolean
  sharedSystem: {
    palette: string
    typography: string
    geometry: string
    personality: string[]
    voice: string[]
  }
  guidance: {
    carries: string
    adapts: string
  }
  website: {
    label: string
    positioning: string
    clientPromise: string
    action: string
  }
  social: {
    label: string
    messageLabel: string
    message: string
    foundationContext: string
    voiceTreatment: string
  }
  print: {
    label: string
    proofLabel: string
    serviceContext: string
    clientMessage: string
  }
}

export function createBrandApplicationViewModel(
  draft: BlueprintDraft,
  presentation: BlueprintPresentationProfile,
): BrandApplicationViewModel {
  const { answers, content } = draft.config
  const brandName = draft.brandName.trim() || "Your salon name"
  const offerAudience = answers.offerAudience.trim()
  const messagePriority = answers.alwaysCommunicate.trim()
  const personality = presentation.personality.modifiers.map((modifier) => modifier.label)
  const voice = presentation.voice.traits.map((trait) => trait.label)
  const isPartial =
    draft.brandName.trim() === "" ||
    offerAudience === "" ||
    presentation.palette.fallback ||
    presentation.typography.fallback ||
    presentation.geometry.fallback ||
    presentation.personality.fallback ||
    presentation.voice.fallback

  return {
    brandName,
    isPartial,
    sharedSystem: {
      palette: presentation.palette.id,
      typography: presentation.typography.id,
      geometry: presentation.geometry.id,
      personality,
      voice,
    },
    guidance: {
      carries: "Color, typography, shape, and voice stay recognizable.",
      adapts: "Layout, information density, and message length adapt to each channel.",
    },
    website: {
      label: "Representative website moment",
      positioning: content.essence,
      clientPromise: content.audiencePromise,
      action: "Request an appointment",
    },
    social: {
      label: "Representative social tile",
      messageLabel: "Example campaign line",
      message: "A salon moment, shaped with care.",
      foundationContext:
        offerAudience || "Example service context — add the salon experience and clients here.",
      voiceTreatment:
        voice.length > 0
          ? `${voice.join(" · ")} voice`
          : "Neutral voice example until traits are selected",
    },
    print: {
      label: "Illustrative print proof — not print-ready",
      proofLabel: "Appointment / service card",
      serviceContext:
        offerAudience || "Example service context — add the salon experience and clients here.",
      clientMessage:
        messagePriority || "Example client message — add the promise clients should remember.",
    },
  }
}
