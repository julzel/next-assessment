import type { BlueprintPresentationProfile } from "@/lib/blueprint/presentation"
import { cn } from "@/lib/utils"

export function DesignRationale({
  presentation,
}: {
  presentation: BlueprintPresentationProfile
}) {
  return (
    <section
      className={cn(
        "mt-8 border p-5 sm:p-6",
        presentation.palette.softSurfaceClass,
        presentation.palette.borderClass,
        presentation.geometry.sectionClass,
      )}
      data-design-rationale=""
    >
      <p className={cn("text-xs", presentation.typography.labelClass)}>Design rationale</p>
      <h2 className={cn("mt-2 text-2xl", presentation.typography.displayClass)}>
        Why this direction works
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {presentation.rationale.map((item, index) => (
          <li
            key={`${item.dimension}-${item.label}-${index}`}
            className={cn(
              "border-t pt-3",
              presentation.palette.borderClass,
              item.fallback && "opacity-70",
            )}
            data-rationale-dimension={item.dimension}
            data-rationale-fallback={item.fallback ? "true" : "false"}
          >
            <p className="text-sm font-semibold">
              {item.fallback ? `Default while undecided: ${item.label}` : item.label}
            </p>
            <p className={cn("mt-1 text-sm leading-6", presentation.palette.mutedTextClass)}>
              {item.effect}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
