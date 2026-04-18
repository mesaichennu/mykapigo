import { ContactForm } from "@/components/site/contact-form"
import { Mail, MessageCircle, MapPin } from "lucide-react"

export const metadata = {
  title: "Contact us",
  description: "Questions, orders, partnerships — reach the MyKapiGo team.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">We&apos;d love to hear from you</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Questions about an order, a product or our Buy From India service? Drop us a note and we&apos;ll get back within 24 hours.
        </p>
      </header>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:hello@mykapigo.com" className="text-muted-foreground hover:text-foreground">
                hello@mykapigo.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Based in</p>
              <p className="text-muted-foreground">Bengaluru, India</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
