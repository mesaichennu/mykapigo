"use client"

import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Contact } from "@/lib/types"

export function MessagesManager({ messages }: { messages: Contact[] }) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  async function toggleHandled(m: Contact) {
    const { error } = await supabase.from("contacts").update({ handled: !m.handled }).eq("id", m.id)
    if (error) {
      toast.error(error.message)
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">{messages.length} contact form submissions</p>
      </div>
      <div className="space-y-3">
        {messages.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <div className="font-medium">{m.subject || "No subject"}</div>
                <div className="text-sm text-muted-foreground">
                  {m.name} &middot; {m.email} &middot; {new Date(m.created_at).toLocaleString()}
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
              </div>
              <Button variant={m.handled ? "outline" : "default"} size="sm" onClick={() => toggleHandled(m)}>
                {m.handled ? "Mark unhandled" : "Mark handled"}
              </Button>
            </div>
          </Card>
        ))}
        {messages.length === 0 && <Card className="p-10 text-center text-muted-foreground">No messages yet.</Card>}
      </div>
    </div>
  )
}
