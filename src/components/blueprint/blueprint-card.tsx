import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlueprintSummary } from "@/lib/blueprint/types"

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export function BlueprintCard({ blueprint }: { blueprint: BlueprintSummary }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{blueprint.brandName}</CardTitle>
          <Badge variant="secondary" className="capitalize">
            {blueprint.template}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Updated {dateFormatter.format(new Date(blueprint.updatedAt))}
        </p>
        <Link
          href={`/blueprints/${blueprint.id}`}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Open<span className="sr-only"> {blueprint.brandName}</span>
        </Link>
      </CardContent>
    </Card>
  )
}
