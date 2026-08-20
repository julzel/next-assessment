import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function BlueprintNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium text-primary">Blueprint not found</p>
      <h1 className="text-3xl font-semibold tracking-tight">This saved blueprint no longer exists.</h1>
      <div>
        <Button render={<Link href="/" />}>Return to library</Button>
      </div>
    </main>
  )
}
