export default function BlueprintLoading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8 sm:py-12">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    </main>
  )
}
