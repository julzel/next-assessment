/** Seeds one reusable, valid Brand Blueprint when the library is empty. */
import { listBlueprints, insertBlueprint } from "../src/db/blueprints"
import { buildDeterministicContent } from "../src/lib/blueprint/content"
import type { BrandAnswers } from "../src/lib/blueprint/types"

if (listBlueprints().length > 0) {
  console.log("Blueprint library already has records — skipping seed.")
} else {
  const answers: BrandAnswers = {
    offerAudience: "Independent founders building thoughtful products",
    personalityTraits: ["confident", "curious", "precise"],
    visualDirection: "minimal",
    colorDirection: "cool",
    typographyDirection: "modern-sans",
    voiceTraits: ["clear", "thoughtful"],
    alwaysCommunicate: "calm, useful clarity",
    avoid: "empty buzzwords",
  }

  insertBlueprint({
    brandName: "Northstar Studio",
    template: "editorial",
    config: {
      schemaVersion: 1,
      answers,
      content: buildDeterministicContent(answers),
    },
  })

  console.log("Seeded 1 Brand Blueprint.")
}
