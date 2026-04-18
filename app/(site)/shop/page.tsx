import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/site/product-card"
import { cn } from "@/lib/utils"
import type { Category, Product } from "@/lib/types"

export const revalidate = 60

export const metadata = {
  title: "Shop",
  description: "Browse authentic Indian products shipped worldwide.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  let query = supabase
    .from("products")
    .select("*, category:categories(id,slug,name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (category) {
    const cat = (categories ?? []).find((c) => c.slug === category)
    if (cat) query = query.eq("category_id", cat.id)
  }
  if (q) query = query.ilike("name", `%${q}%`)

  const { data: products } = await query

  const cats = (categories ?? []) as Category[]
  const items = (products ?? []) as Product[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Collection</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Shop all products</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          From Banarasi silks to Kashmiri saffron — every item is sourced from trusted Indian artisans and vendors.
        </p>
      </header>

      {/* Categories filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition",
            !category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary/40",
          )}
        >
          All
        </Link>
        {cats.map((c) => {
          const active = category === c.slug
          return (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {c.name}
            </Link>
          )
        })}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No products match this filter yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
