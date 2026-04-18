export const metadata = {
  title: "About MyKapiGo",
  description: "Our story, mission and the artisans we work with.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Our story</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">A bridge between India and the world</h1>
      </header>

      <div className="mt-10 space-y-8 text-pretty text-lg leading-relaxed text-muted-foreground">
        <p>
          MyKapiGo was born from a simple idea: make it effortless for anyone, anywhere, to access the
          authentic products and crafts of India. Whether it&apos;s a Banarasi saree for a wedding, the exact
          brand of masala your grandmother used, or a hand-painted Madhubani artwork for your living
          room — we want to be the reliable bridge that makes it happen.
        </p>
        <p>
          We work directly with artisans and trusted vendors across India. No middlemen marking things
          up, no mystery sourcing. Every product we ship has a story and a maker behind it.
        </p>
        <p>
          For items outside our curated catalog, our Buy From India concierge sources anything you need — from
          obscure regional books to bulk spice orders — and handles export-grade packing and shipping
          to more than 40 countries.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          { t: "Authentic", d: "Sourced directly from verified Indian artisans and vendors." },
          { t: "Transparent", d: "Clear pricing, tracked shipping, honest timelines." },
          { t: "Reliable", d: "Export-grade packing, insured transit, responsive support." },
        ].map((v) => (
          <div key={v.t} className="rounded-xl border border-border/60 bg-card p-6">
            <h3 className="font-serif text-xl">{v.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
