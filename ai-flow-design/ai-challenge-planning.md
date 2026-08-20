# General Workflow Steps

Use [`codex-specific-workflow.md`](./codex-specific-workflow.md) as the execution source of truth. Product and workflow source documents live in `ai-flow-design/`; generated planning, review, and progress artifacts live in `ai-implementation/`.

# AI Challenge Planning

1. Understand the challenge. See [`challenge.md`](./challenge.md).
2. Explore the existing codebase
3. Define the product scope
4. Design the solution
5. Create an implementation plan
6. Implement incrementally with AI
7. Continuously validate the product

## Recommended validation steps

8. Use AI for adversarial review
9. Polish against the evaluation criteria

After every stage—and after every implementation slice in stage 6—append a dated entry to [`ai-implementation/changelog.md`](../ai-implementation/changelog.md) that records the completed work, evidence or validation, unresolved issues, exactly one next logical step, and the recommended model plus reasoning effort for that next step.
