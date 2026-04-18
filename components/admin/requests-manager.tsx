"use client"

import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { ServiceRequest } from "@/lib/types"

const STATUSES = ["new", "quoted", "approved", "sourcing", "shipped", "closed"]

export function RequestsManager({ requests }: { requests: ServiceRequest[] }) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("service_requests").update({ status }).eq("id", id)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Updated")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Buy From India requests</h1>
        <p className="text-sm text-muted-foreground">{requests.length} concierge requests</p>
      </div>
      <div className="space-y-3">
        {requests.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <div className="font-medium">{r.product_name}</div>
                <div className="text-sm text-muted-foreground">
                  {r.customer_name} &middot; {r.email} &middot; {r.country}
                </div>
                {r.whatsapp && <div className="text-xs text-muted-foreground">WhatsApp: {r.whatsapp}</div>}
                {r.product_link && (
                  <a
                    href={r.product_link}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-primary underline"
                  >
                    {r.product_link}
                  </a>
                )}
                {r.product_description && (
                  <div className="text-sm text-muted-foreground">{r.product_description}</div>
                )}
                <div className="text-xs text-muted-foreground">
                  Qty {r.quantity} &middot; Budget {r.budget ? `${r.currency} ${r.budget}` : "not specified"}{" "}
                  &middot; Ship to {r.shipping_destination}
                </div>
                {r.notes && <div className="mt-1 text-sm">{r.notes}</div>}
              </div>
              <div className="flex items-center gap-2">
                <Select value={r.status} onValueChange={(v) => setStatus(r.id, v)}>
                  <SelectTrigger className="h-9 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
        {requests.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground">No requests yet.</Card>
        )}
      </div>
    </div>
  )
}
