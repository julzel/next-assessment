import Link from "next/link"

import { BlueprintCard } from "@/components/blueprint/blueprint-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlueprintSummary } from "@/lib/blueprint/types"

export function BlueprintLibrary({ blueprints }: { blueprints: BlueprintSummary[] }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12 sm:py-16">
      <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <Badge variant="secondary">Brand strategy workspace</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Brand Blueprints</h1>
            <p className="max-w-2xl text-muted-foreground">
              Turn a clear brand direction into a concise, presentation-ready blueprint.
            </p>
          </div>
        </div>
        <Button render={<Link href="/blueprints/new" />} size="lg">
          New blueprint
        </Button>
      </header>

      {blueprints.length > 0 ? (
        <section aria-label="Saved blueprints" className="grid gap-4 sm:grid-cols-2">
          {blueprints.map((blueprint) => (
            <BlueprintCard key={blueprint.id} blueprint={blueprint} />
          ))}
        </section>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Your library is ready for its first blueprint.</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <p className="max-w-xl text-muted-foreground">
              Capture a brand name, choose a presentation direction, and save the first version for
              your client.
            </p>
            <Button render={<Link href="/blueprints/new" />}>Create your first blueprint</Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
