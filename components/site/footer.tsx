import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary font-serif text-lg font-semibold text-primary-foreground">
              M
            </span>
            <span className="font-serif text-xl font-semibold">MyKapiGo</span>
          </Link>
          <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Authentic Indian craftsmanship, delivered to your doorstep. And when you need
            something specific from India, our Buy From India concierge sources it for you.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Shop</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-foreground">All products</Link></li>
            <li><Link href="/shop?category=handicrafts" className="hover:text-foreground">Handicrafts</Link></li>
            <li><Link href="/shop?category=textiles" className="hover:text-foreground">Textiles</Link></li>
            <li><Link href="/shop?category=spices" className="hover:text-foreground">Spices</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Buy From India</Link></li>
            <li><Link href="/shipping" className="hover:text-foreground">Shipping</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} MyKapiGo. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Secure payments via PhonePe</span>
            <span>·</span>
            <span>Worldwide shipping</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
