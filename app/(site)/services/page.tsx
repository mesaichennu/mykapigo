import { ServiceRequestForm } from "@/components/site/service-request-form"
import { ClipboardList, MessageCircle, PackageSearch, Plane } from "lucide-react"

export const metadata = {
  title: "Buy From India — concierge sourcing service",
  description:
    "Tell us what you need and our team will source it from India and ship it to your door, anywhere in the world.",
}

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. Tell us what you need",
    body: "Share a link, photo or just a description. Brand, size, quantity — anything helps.",
  },
  {
    icon: MessageCircle,
    title: "2. Get a quote in 48 hours",
    body: "We confirm availability, packing plan and total price including shipping and duties.",
  },
  {
    icon: PackageSearch,
    title: "3. We source and pack",
    body: "Our team purchases, quality-checks and export-packs your items in India.",
  },
  {
    icon: Plane,
    title: "4. Delivered to your door",
    body: "Ship via express or economy with full tracking. Typically 5–15 days worldwide.",
  },
]

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Concierge service
        </p>
        <h1 className="mt-3 text-balance font-serif text-4xl md:text-6xl">
          Buy From India
        </h1>
        <p className="mt-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
          Anything made or sold in India — we&apos;ll source, pack and ship it to you. From
          regional groceries and books to handcrafted gifts for a family wedding.
        </p>
      </header>

      <section className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-border/60 bg-card p-5"
          >
            <s.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-medium">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="font-serif text-3xl">Send us your request</h2>
          <p className="mt-3 text-muted-foreground">
            Fill in as much detail as you have. Our team replies within 48 hours with a personalized quote.
            There&apos;s no obligation to proceed until you approve.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-medium">Pricing</dt>
              <dd className="text-muted-foreground">
                Product cost + sourcing fee (10–15%) + shipping &amp; duties. Fully transparent.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Payment</dt>
              <dd className="text-muted-foreground">
                Pay securely via PhonePe, card, or international bank transfer.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Restrictions</dt>
              <dd className="text-muted-foreground">
                We can&apos;t ship alcohol, medication, weapons or other restricted categories.
              </dd>
            </div>
          </dl>
        </div>
        <ServiceRequestForm />
      </section>
    </div>
  )
}
