import { connection } from "next/server"

import { BlueprintLibrary } from "@/components/blueprint/blueprint-library"
import { listBlueprints } from "@/db/blueprints"

export default async function Home() {
  await connection()
  const blueprints = listBlueprints()

  return <BlueprintLibrary blueprints={blueprints} />
}
