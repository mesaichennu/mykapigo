"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function ServiceRequestForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      customer_name: String(form.get("customer_name") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || ""),
      whatsapp: String(form.get("whatsapp") || "") || null,
      product_name: String(form.get("product_name") || ""),
      product_link: String(form.get("product_link") || "") || null,
      product_description: String(form.get("product_description") || "") || null,
      quantity: Number(form.get("quantity") || 1),
      budget: form.get("budget") ? Number(form.get("budget")) : null,
      currency: String(form.get("currency") || "USD"),
      shipping_destination: String(form.get("shipping_destination") || ""),
      notes: String(form.get("notes") || "") || null,
    }

    if (!payload.customer_name || !payload.email || !payload.country || !payload.product_name || !payload.shipping_destination) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from("service_requests").insert(payload)
    setLoading(false)
    if (error) {
      toast.error("Could not submit request", { description: error.message })
      return
    }
    setSubmitted(true)
    toast.success("Request received! We'll email you a quote within 48 hours.")
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-accent p-8 text-accent-foreground">
        <h3 className="font-serif text-2xl">Thanks — we have your request!</h3>
        <p className="mt-2 text-sm">
          Our team will review and email you a personalized quote within 48 hours. You can also WhatsApp us for a faster response.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="customer_name">Your name *</Label>
          <Input id="customer_name" name="customer_name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country">Your country *</Label>
          <Input id="country" name="country" placeholder="United States" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
          <Input id="whatsapp" name="whatsapp" placeholder="+1 555 123 4567" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="product_name">Product name *</Label>
        <Input id="product_name" name="product_name" placeholder="e.g. MDH Deggi Mirch Masala 500g" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="product_link">Reference link (optional)</Label>
        <Input id="product_link" name="product_link" type="url" placeholder="https://..." />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="product_description">Description / brand / size</Label>
        <Textarea id="product_description" name="product_description" rows={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="budget">Budget</Label>
          <Input id="budget" name="budget" type="number" min={0} step="0.01" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            name="currency"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue="USD"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>AUD</option>
            <option>CAD</option>
            <option>INR</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="shipping_destination">Shipping destination *</Label>
        <Input id="shipping_destination" name="shipping_destination" placeholder="City, Country" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Additional notes</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full sm:w-auto sm:self-start">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit request"
        )}
      </Button>
    </form>
  )
}
