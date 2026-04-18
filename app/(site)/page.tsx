import Link from "next/link"
import { ArrowRight, Globe2, PackageCheck, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/site/product-card"
import type { Product, Category } from "@/lib/types"

export const revalidate = 60

async function getFeatured() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id,slug,name)")
    .eq("is_active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6)
  return (data ?? []) as Product[]
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
  return (data ?? []) as Category[]
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeatured(), getCategories()])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Crafted in India · Shipped worldwide
            </p>
            <h1 className="text-balance font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
              Authentic India, delivered to your doorstep.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Shop a curated collection of handicrafts, textiles, spices and wellness essentials —
              or ask us to source anything specific from India with our concierge service.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/shop">
                  Shop the collection
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">Buy From India service</Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="font-serif text-2xl text-primary">120+</dt>
                <dd className="text-muted-foreground">Artisans</dd>
              </div>
              <div>
                <dt className="font-serif text-2xl text-primary">40+</dt>
                <dd className="text-muted-foreground">Countries shipped</dd>
              </div>
              <div>
                <dt className="font-serif text-2xl text-primary">4.9★</dt>
                <dd className="text-muted-foreground">Avg. rating</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="/img2.png"
                  alt="Handcrafted Indian textiles"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-8 space-y-3">
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img
                    src="/img1.png"
                    alt="Jaipur blue pottery"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img
                    src="/img3.png"
                    alt="Kashmiri saffron"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -left-4 -bottom-6 hidden rounded-xl border border-border bg-card px-4 py-3 shadow-sm sm:block">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Free shipping over</p>
              <p className="font-serif text-lg font-semibold">₹5,000 in India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">Shop by category</h2>
              <p className="mt-2 text-muted-foreground">
                Six carefully curated collections from across India.
              </p>
            </div>
            <Link href="/shop" className="hidden text-sm text-primary hover:underline sm:inline-flex">
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="group relative flex h-40 items-end overflow-hidden rounded-xl border border-border/60 bg-muted p-5 transition hover:border-primary/40"
              >
                <img
                  src={c.image_url || `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(c.name + " india")}`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="relative">
                  <h3 className="font-serif text-xl text-background">{c.name}</h3>
                  <p className="mt-1 text-xs text-background/80">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">Featured this week</h2>
              <p className="mt-2 text-muted-foreground">Editor&apos;s picks from our artisans.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/shop">All products</Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Buy From India */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
              Concierge service
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl md:text-5xl">
              Need something specific from India? We&apos;ll get it.
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-primary-foreground/85">
              From a regional book to a family favorite brand of pickle — tell us what you need,
              and our team will source, pack, and ship it to you.
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-6">
              <Link href="/services">Request a product</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Globe2, t: "Worldwide", d: "We ship to 40+ countries with full tracking." },
              { icon: ShieldCheck, t: "Vetted sellers", d: "Every item sourced from trusted vendors." },
              { icon: PackageCheck, t: "Safe packing", d: "Export-grade packaging, insured in transit." },
              { icon: Sparkles, t: "Any product", d: "From groceries to heirloom jewelry." },
            ].map((f) => (
              <div
                key={f.t}
                className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-5"
              >
                <f.icon className="h-5 w-5 text-primary-foreground" />
                <h3 className="mt-3 font-medium">{f.t}</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-serif text-3xl md:text-4xl">
            Loved by customers across the globe
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                q: "I finally found the same masalas my grandmother used. Packaging was immaculate.",
                a: "Priya S., London",
              },
              {
                q: "The Buy From India team sourced a book that had been out of print for decades.",
                a: "Raj M., Toronto",
              },
              {
                q: "Beautiful pottery, arrived faster than expected. Will definitely order again.",
                a: "Emma W., Sydney",
              },
            ].map((t) => (
              <figure
                key={t.a}
                className="rounded-xl border border-border/60 bg-card p-6"
              >
                <blockquote className="font-serif text-lg leading-snug text-pretty">
                  &ldquo;{t.q}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
