"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatINR } from "@/lib/format"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const shipping = subtotal >= 5000 ? 0 : subtotal > 0 ? 199 : 0
  const total = subtotal + shipping

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl md:text-5xl">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-lg">Your cart is empty.</p>
          <p className="text-muted-foreground">Start adding things you love.</p>
          <Button asChild className="mt-6">
            <Link href="/shop">Browse the shop</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 md:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-5">
                <Link
                  href={`/shop/${item.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted"
                >
                  <img
                    src={item.image_url || "/placeholder.svg?height=200&width=200"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/shop/${item.slug}`} className="font-serif text-lg hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{formatINR(item.price)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-md border border-border">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-medium">{formatINR(item.price * item.quantity)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping (India)</dt>
                <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatINR(total)}</dd>
              </div>
            </dl>
            <Button asChild className="mt-6 w-full" size="lg">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              International shipping calculated at checkout.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
