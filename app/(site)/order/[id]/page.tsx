import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { formatINR, formatDate } from "@/lib/format"
import type { Order, OrderItem, ShippingUpdate } from "@/lib/types"
import { CheckCircle2, Clock, PackageCheck, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const STATUS_STEPS: { key: Order["status"]; label: string; icon: typeof Clock }[] = [
  { key: "pending", label: "Pending payment", icon: Clock },
  { key: "paid", label: "Payment received", icon: CheckCircle2 },
  { key: "processing", label: "Preparing", icon: PackageCheck },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
]

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ demo?: string }>
}) {
  const { id } = await params
  const { demo } = await searchParams
  const supabase = await createClient()

  // Order number is public-facing, so we look up by that (RLS allows insert-only for
  // anonymous, so we fetch this via service-level read — but for tracking we only
  // expose by exact order number match and by omitting sensitive fields.)
  // Because RLS restricts SELECT to admins, use the admin-safe RPC fallback:
  // we'll rely on the /api route pattern — here, since RLS blocks reads, we do a
  // direct select which will return nothing for anonymous users. We therefore
  // use a public-safe server call via service role is NOT available; instead, we
  // expose a minimal `track_order` pathway via SQL function is not ideal.
  //
  // Simpler approach: allow anonymous select on orders WHERE order_number matches
  // is implemented by a secure SQL function. We call it via rpc.

  const { data: orderRow } = await supabase
    .rpc("track_order", { p_order_number: id })
    .maybeSingle()

  if (!orderRow) return notFound()

  const order = orderRow as Order

  const { data: items } = await supabase
    .rpc("track_order_items", { p_order_number: id })

  const { data: updates } = await supabase
    .rpc("track_order_updates", { p_order_number: id })

  const orderItems = (items ?? []) as OrderItem[]
  const shipUpdates = (updates ?? []) as ShippingUpdate[]

  const currentIdx = Math.max(
    0,
    STATUS_STEPS.findIndex((s) => s.key === order.status),
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {order.payment_status === "paid" && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-accent p-6 text-accent-foreground">
          <h2 className="font-serif text-2xl">Thank you — your order is confirmed!</h2>
          <p className="mt-1 text-sm">
            We&apos;ve emailed the receipt to {order.customer_email}. You can bookmark this page to track progress.
            {demo && " (This was a demo checkout — no real payment was taken.)"}
          </p>
        </div>
      )}

      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Order number
          </p>
          <h1 className="mt-1 font-mono text-2xl">{order.order_number}</h1>
        </div>
        <div className="text-right text-sm">
          <p className="text-muted-foreground">Placed {formatDate(order.created_at)}</p>
          <p className="font-medium">{formatINR(Number(order.total))}</p>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="font-serif text-xl">Status</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-5">
          {STATUS_STEPS.map((s, idx) => {
            const active = idx <= currentIdx
            return (
              <li
                key={s.key}
                className={cn(
                  "rounded-xl border p-4 text-sm",
                  active ? "border-primary bg-primary/10" : "border-border bg-card text-muted-foreground",
                )}
              >
                <s.icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                <p className="mt-2 font-medium">{s.label}</p>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-serif text-lg">Items</h3>
          <ul className="mt-4 divide-y divide-border text-sm">
            {orderItems.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-3 py-3">
                <div className="flex gap-3">
                  <img
                    src={i.product_image || "/placeholder.svg?height=80&width=80"}
                    alt=""
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{i.product_name}</p>
                    <p className="text-muted-foreground">× {i.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">{formatINR(Number(i.line_total))}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(Number(order.subtotal))}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{Number(order.shipping_fee) === 0 ? "Free" : formatINR(Number(order.shipping_fee))}</dd></div>
            <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatINR(Number(order.total))}</dd></div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-serif text-lg">Shipping timeline</h3>
          {shipUpdates.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Updates will appear here as your order moves.
            </p>
          ) : (
            <ol className="mt-4 space-y-4 text-sm">
              {shipUpdates.map((u) => (
                <li key={u.id} className="relative pl-6">
                  <span className="absolute left-0 top-1 inline-block h-3 w-3 rounded-full bg-primary" />
                  <p className="font-medium">{u.status}</p>
                  {u.location && <p className="text-muted-foreground">{u.location}</p>}
                  {u.note && <p className="text-muted-foreground">{u.note}</p>}
                  <p className="text-xs text-muted-foreground">{formatDate(u.created_at)}</p>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-6 border-t border-border pt-4 text-sm">
            <p className="text-muted-foreground">Shipping to</p>
            <p className="mt-1">
              {order.shipping_address.line1}
              {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""},<br />
              {order.shipping_address.city}, {order.shipping_address.state}{" "}
              {order.shipping_address.postal_code},<br />
              {order.shipping_address.country}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 text-sm">
        Need help?{" "}
        <Link href="/contact" className="text-primary underline-offset-2 hover:underline">
          Contact us
        </Link>
        .
      </div>
    </div>
  )
}
