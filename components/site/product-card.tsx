import Link from "next/link"
import type { Product } from "@/lib/types"
import { formatINR } from "@/lib/format"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || "/placeholder.svg?height=600&width=600&query=indian%20product"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.category?.name && (
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {product.category.name}
          </p>
        )}
        <h3 className="text-pretty font-serif text-lg leading-snug">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-sm font-medium">{formatINR(Number(product.price))}</p>
      </div>
    </Link>
  )
}
