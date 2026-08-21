"use client"

import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium text-primary">Something went wrong</p>
      <h1 className="text-3xl font-semibold tracking-tight">We could not load this blueprint view.</h1>
      <p className="text-muted-foreground">Please return to the library and try again.</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants()}>
          Back to library
        </Link>
      </div>
    </main>
  )
}
