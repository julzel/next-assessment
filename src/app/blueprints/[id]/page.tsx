import { notFound } from "next/navigation"
import { connection } from "next/server"

import { BlueprintWorkspace } from "@/components/blueprint/blueprint-workspace"
import { getBlueprint } from "@/db/blueprints"

export default async function BlueprintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isSafeInteger(id) || id <= 0) notFound()

  await connection()
  const blueprint = getBlueprint(id)
  if (!blueprint) notFound()

  return <BlueprintWorkspace initialDraft={blueprint} />
}
