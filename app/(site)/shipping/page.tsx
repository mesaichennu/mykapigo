export const metadata = {
  title: "Shipping & Delivery",
  description: "How we ship, timelines, duties and returns.",
}

const ZONES = [
  { region: "India", time: "2–5 business days", shipping: "Free over ₹5,000 · ₹199 standard" },
  { region: "United States · Canada", time: "5–10 business days", shipping: "From $19 · free over $150" },
  { region: "United Kingdom · Europe", time: "5–10 business days", shipping: "From £15 · free over £120" },
  { region: "Australia · New Zealand", time: "7–12 business days", shipping: "From A$25 · free over A$200" },
  { region: "Middle East · Asia", time: "5–9 business days", shipping: "From $15 · free over $120" },
  { region: "Rest of world", time: "10–15 business days", shipping: "Calculated at checkout" },
]

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Logistics</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Shipping &amp; delivery</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          We ship to 40+ countries via trusted carriers (DHL, FedEx, India Post Speed). Every order
          comes with a tracking link you can follow from Mumbai to your door.
        </p>
      </header>

      <section className="mt-10 overflow-hidden rounded-xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-5 py-3 font-medium">Destination</th>
              <th className="px-5 py-3 font-medium">Delivery</th>
              <th className="px-5 py-3 font-medium">Shipping</th>
            </tr>
          </thead>
          <tbody>
            {ZONES.map((z) => (
              <tr key={z.region} className="border-t border-border/60">
                <td className="px-5 py-4 font-medium">{z.region}</td>
                <td className="px-5 py-4 text-muted-foreground">{z.time}</td>
                <td className="px-5 py-4 text-muted-foreground">{z.shipping}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="font-serif text-xl">Duties &amp; taxes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For most destinations, import duties and local taxes are paid by the recipient on delivery.
            We&apos;ll declare the correct value on the customs invoice.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="font-serif text-xl">Returns</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Damaged in transit? Email us within 7 days with photos and we&apos;ll refund or reship.
            Perishable goods (spices, groceries) are non-returnable unless defective.
          </p>
        </div>
      </section>
    </div>
  )
}
