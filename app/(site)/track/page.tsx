"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TrackPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = orderNumber.trim()
    if (!code) return
    router.push(`/order/${encodeURIComponent(code)}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order tracking</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Where is my order?</h1>
        <p className="mt-3 text-muted-foreground">
          Enter your order number (e.g. <span className="font-mono">MKG-260418-ab12cd</span>) and we&apos;ll show the latest status.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-10 flex max-w-md flex-col gap-3 rounded-2xl border border-border bg-card p-6"
      >
        <Label htmlFor="order_number">Order number</Label>
        <Input
          id="order_number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="MKG-XXXXXX-XXXXXX"
          required
        />
        <Button type="submit" className="mt-2">Track order</Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Can&apos;t find your order number? Check your confirmation email or{" "}
        <a href="/contact" className="text-primary underline-offset-2 hover:underline">
          contact us
        </a>
        .
      </p>
    </div>
  )
}
