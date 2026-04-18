"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  function handleAdd() {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
      },
      qty,
    )
    toast.success("Added to cart", { description: `${product.name} × ${qty}` })
  }

  const disabled = product.stock <= 0

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-md border border-border">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="px-3 py-2 text-muted-foreground transition hover:text-foreground"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-sm font-medium">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          className="px-3 py-2 text-muted-foreground transition hover:text-foreground"
          onClick={() => setQty((q) => q + 1)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Button onClick={handleAdd} size="lg" disabled={disabled} className="flex-1 sm:flex-none">
        <ShoppingBag className="mr-2 h-4 w-4" />
        {disabled ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  )
}
