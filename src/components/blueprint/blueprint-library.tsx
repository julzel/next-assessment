import Link from "next/link"

import { BlueprintCard } from "@/components/blueprint/blueprint-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlueprintSummary } from "@/lib/blueprint/types"

export function BlueprintLibrary({ blueprints }: { blueprints: BlueprintSummary[] }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12 sm:py-16">
      <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <Badge variant="secondary">Salon brand strategy workspace</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Brand Blueprints</h1>
            <p className="max-w-2xl text-muted-foreground">
              Shape one salon brand direction for your website, social media, and printed
              touchpoints.
            </p>
          </div>
        </div>
        <Link href="/blueprints/new" className={buttonVariants({ size: "lg" })}>
          New blueprint
        </Link>
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
              Add your salon name, choose a presentation direction, and shape a client-ready brand
              guide without needing design expertise.
            </p>
            <Link href="/blueprints/new" className={buttonVariants()}>
              Create your first blueprint
            </Link>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
