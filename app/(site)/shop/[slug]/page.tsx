import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AddToCartButton } from "@/components/site/add-to-cart-button"
import { formatINR } from "@/lib/format"
import type { Product } from "@/lib/types"
import { PackageCheck, ShieldCheck, Truck } from "lucide-react"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("products").select("name, description").eq("slug", slug).maybeSingle()
  return {
    title: data?.name ?? "Product",
    description: data?.description ?? undefined,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id,slug,name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()

  if (!data) return notFound()
  const product = data as Product

  const { data: related } = await supabase
    .from("products")
    .select("*, category:categories(id,slug,name)")
    .eq("is_active", true)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)

  const relatedItems = (related ?? []) as Product[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        {product.category?.slug && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted">
          <img
            src={product.image_url || "/placeholder.svg?height=800&width=800"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          {product.category?.name && (
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-2 text-balance font-serif text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 font-serif text-2xl text-primary">
            {formatINR(Number(product.price))}
          </p>
          {product.description && (
            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <ul className="mt-8 grid gap-3 text-sm">
            <li className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-primary" />
              <span>
                <strong className="font-medium">Worldwide shipping</strong> — 5–15 business days depending on destination.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
              <span>
                <strong className="font-medium">Authenticity guarantee</strong> — sourced directly from Indian artisans and verified vendors.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <PackageCheck className="mt-0.5 h-4 w-4 text-primary" />
              <span>
                <strong className="font-medium">Export-grade packing</strong> — protective packaging, insured in transit.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {relatedItems.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-serif text-2xl md:text-3xl">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedItems.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="group overflow-hidden rounded-xl border border-border/60 bg-card"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={p.image_url || "/placeholder.svg?height=500&width=500"}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-pretty font-serif text-base">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatINR(Number(p.price))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
