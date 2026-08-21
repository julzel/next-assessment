import type {
  BlueprintPresentationProfile,
  PresentationRationaleItem,
} from "@/lib/blueprint/presentation"
import { cn } from "@/lib/utils"

const dimensionLabels: Record<PresentationRationaleItem["dimension"], string> = {
  template: "Composition",
  visual: "Shape and rhythm",
  color: "Palette",
  typography: "Type system",
  personality: "Character cue",
  voice: "Client communication",
}

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
      <h3 className={cn("mt-2 text-2xl", presentation.typography.displayClass)}>
        Why this direction works
      </h3>
      <p className={cn("mt-2 max-w-2xl text-sm leading-6", presentation.palette.mutedTextClass)}>
        Each choice below names the treatment applied to the salon campaign frame, service story,
        booking cue, and client-facing guidance.
      </p>
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
            <p className={cn("text-[0.65rem]", presentation.typography.labelClass)}>
              {dimensionLabels[item.dimension]}
            </p>
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
