"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { formatINR } from "@/lib/format"
import { toast } from "sonner"
import { Loader2, ShieldCheck, UserCheck } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type UserInfo = { email: string | null; name: string | null }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [userReady, setUserReady] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart")
    }
  }, [items.length, router])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email ?? null,
          name:
            (data.user.user_metadata?.full_name as string | undefined) ||
            (data.user.user_metadata?.name as string | undefined) ||
            null,
        })
      }
      setUserReady(true)
    })
  }, [])

  const shipping = subtotal >= 5000 ? 0 : 199
  const total = subtotal + shipping

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (items.length === 0) return
    const form = new FormData(e.currentTarget)

    const payload = {
      customer_name: String(form.get("name") || ""),
      customer_email: String(form.get("email") || ""),
      customer_phone: String(form.get("phone") || "") || null,
      shipping_address: {
        line1: String(form.get("line1") || ""),
        line2: String(form.get("line2") || "") || undefined,
        city: String(form.get("city") || ""),
        state: String(form.get("state") || ""),
        postal_code: String(form.get("postal_code") || ""),
        country: String(form.get("country") || "India"),
      },
      notes: String(form.get("notes") || "") || null,
      items: items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        product_image: i.image_url,
        unit_price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      shipping_fee: shipping,
      total,
    }

    setLoading(true)
    try {
      const res = await fetch("/api/phonepe/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.status === 401) {
        toast.error("Please sign in to continue", {
          description: "Your cart is safe - you'll come right back here.",
        })
        router.push(`/account/sign-in?redirect=${encodeURIComponent("/checkout")}`)
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to start payment")
      clear()
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else if (data.orderNumber) {
        router.push(`/order/${data.orderNumber}?demo=1`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      toast.error("Payment could not start", { description: message })
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl md:text-5xl">Checkout</h1>

      {userReady && user && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <UserCheck className="h-4 w-4 text-primary" />
          <span>
            Signed in as{" "}
            <span className="font-medium">{user.name || user.email}</span>. This order
            will be saved to your account.
          </span>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" name="name" defaultValue={user?.name ?? ""} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user?.email ?? ""}
                  required
                  readOnly={!!user?.email}
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="phone">Phone (for delivery updates)</Label>
                <Input id="phone" name="phone" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="line1">Address line 1 *</Label>
                <Input id="line1" name="line1" required />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="line2">Address line 2</Label>
                <Input id="line2" name="line2" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State / Region *</Label>
                <Input id="state" name="state" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postal_code">Postal code *</Label>
                <Input id="postal_code" name="postal_code" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" defaultValue="India" required />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="notes">Order notes (optional)</Label>
                <Textarea id="notes" name="notes" rows={3} />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-6 md:sticky md:top-24">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">Order summary</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="flex gap-3">
                    <img
                      src={item.image_url || "/placeholder.svg?height=80&width=80"}
                      alt=""
                      className="h-14 w-14 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">× {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatINR(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatINR(total)}</dd>
              </div>
            </dl>

            <Button type="submit" size="lg" disabled={loading} className="mt-6 w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting payment...
                </>
              ) : (
                `Pay ${formatINR(total)} via PhonePe`
              )}
            </Button>

            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              Payments are processed securely by PhonePe. We never store your card details.
            </p>
          </section>
        </aside>
      </form>
    </div>
  )
}
