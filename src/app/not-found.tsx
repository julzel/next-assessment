import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium text-primary">Not found</p>
      <h1 className="text-3xl font-semibold tracking-tight">That blueprint is not available.</h1>
      <p className="text-muted-foreground">It may have been moved or was never saved.</p>
      <div>
        <Link href="/" className={buttonVariants()}>
          Back to library
        </Link>
      </div>
    </main>
  )
}
