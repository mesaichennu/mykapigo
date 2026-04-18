import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "Frequently asked questions",
  description: "Everything about ordering, shipping and the Buy From India concierge.",
}

const FAQ = [
  {
    q: "Which countries do you ship to?",
    a: "We currently ship to 40+ countries including the USA, Canada, UK, EU, Australia, New Zealand, UAE, Singapore and most of Asia. If your country isn't listed at checkout, contact us for a custom quote.",
  },
  {
    q: "How long will delivery take?",
    a: "Within India: 2–5 business days. International: typically 5–15 business days depending on destination and service level. Every order gets a tracked shipment.",
  },
  {
    q: "What is Buy From India?",
    a: "It's our concierge service for anything outside the store catalog. You send us a link or description, we send you a quote, and on approval we source, pack and ship the items to you.",
  },
  {
    q: "How does payment work?",
    a: "We accept PhonePe, UPI, major credit/debit cards and international bank transfers. All payments are processed securely and you get a receipt by email.",
  },
  {
    q: "Are duties and taxes included?",
    a: "Prices shown do not include import duties or local taxes. These are typically paid by the recipient on delivery. We declare the correct value on the shipping invoice.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Email us within 7 days of delivery with photos and your order number. We'll refund or reship at no extra cost. Perishable goods are excluded unless defective on arrival.",
  },
  {
    q: "Can I ship groceries / spices / herbal products?",
    a: "Yes — most of these are allowed. We cannot ship alcohol, prescription medication, weapons, or items restricted by your country's customs.",
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Help</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Frequently asked questions</h1>
      </header>

      <Accordion type="single" collapsible className="mt-10 divide-y divide-border rounded-xl border border-border/60 bg-card">
        {FAQ.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-0 px-5">
            <AccordionTrigger className="py-5 text-left font-serif text-lg hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
