/** Seeds one reusable, valid Brand Blueprint when the library is empty. */
import { listBlueprints, insertBlueprint } from "../src/db/blueprints"
import { buildDeterministicContent } from "../src/lib/blueprint/content"
import type { BrandAnswers } from "../src/lib/blueprint/types"

if (listBlueprints().length > 0) {
  console.log("Blueprint library already has records — skipping seed.")
} else {
  const answers: BrandAnswers = {
    offerAudience:
      "Thoughtful color and curl care for clients who want a calm, confidence-building visit",
    personalityTraits: ["confident", "warm", "precise"],
    visualDirection: "elegant",
    colorDirection: "earthy",
    typographyDirection: "expressive-contrast",
    voiceTraits: ["warm", "thoughtful"],
    alwaysCommunicate: "Personal care, clear expertise, and confidence at every appointment",
    avoid: "pressure, beauty stereotypes, or unclear promises",
  }

  insertBlueprint({
    brandName: "Marigold Salon",
    template: "warm",
    config: {
      schemaVersion: 1,
      answers,
      content: buildDeterministicContent(answers),
    },
  })

  console.log("Seeded 1 Brand Blueprint.")
}
