"use client"

import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"

export default function BlueprintError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium text-primary">Blueprint unavailable</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        We could not load this saved Blueprint.
      </h1>
      <p className="text-muted-foreground">
        Try loading it again. Your last successfully saved version remains in the library.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Return to library
        </Link>
      </div>
    </main>
  )
}
