"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      subject: String(form.get("subject") || "") || null,
      message: String(form.get("message") || ""),
    }
    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill all required fields")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from("contacts").insert(payload)
    setLoading(false)
    if (error) {
      toast.error("Could not send message", { description: error.message })
      return
    }
    setDone(true)
    toast.success("Message sent! We'll reply within 24 hours.")
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-accent p-8 text-accent-foreground">
        <h3 className="font-serif text-2xl">Message received</h3>
        <p className="mt-2 text-sm">We usually reply within 24 hours. Check your email soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" name="message" rows={6} required />
      </div>
      <Button type="submit" disabled={loading} className="mt-2 w-full sm:w-auto sm:self-start">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  )
}
