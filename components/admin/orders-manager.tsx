"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatINR } from "@/lib/format"
import { toast } from "sonner"
import { Eye, Plus, Loader2 } from "lucide-react"

type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: any
  subtotal: number
  shipping_fee: number
  total: number
  status: string
  payment_status: string
  created_at: string
  order_items: {
    product_name: string
    quantity: number
    unit_price: number
    line_total: number
  }[]
  shipping_updates: { status: string; location: string | null; note: string | null; created_at: string }[]
}

const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]

export function OrdersManager({ orders }: { orders: Order[] }) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)
  const [updateForm, setUpdateForm] = useState({ status: "", location: "", note: "" })

  async function updateStatus(order: Order, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Order status updated")
    router.refresh()
  }

  async function addShippingUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setUpdating(true)
    try {
      const { error } = await supabase.from("shipping_updates").insert({
        order_id: selected.id,
        status: updateForm.status,
        location: updateForm.location || null,
        note: updateForm.note || null,
      })
      if (error) throw error
      toast.success("Shipping update added")
      setUpdateForm({ status: "", location: "", note: "" })
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{o.order_number}</td>
                  <td className="px-4 py-3">
                    <div>{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="px-4 py-3">{formatINR(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        o.payment_status === "paid"
                          ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                          : "rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      }
                    >
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Select value={o.status} onValueChange={(v) => updateStatus(o, v)}>
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Dialog
                      open={selected?.id === o.id}
                      onOpenChange={(open) => setSelected(open ? o : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order {o.order_number}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Customer</div>
                              <div className="text-muted-foreground">{o.customer_name}</div>
                              <div className="text-muted-foreground">{o.customer_email}</div>
                              <div className="text-muted-foreground">{o.customer_phone}</div>
                            </div>
                            <div>
                              <div className="font-medium">Ship to</div>
                              <div className="text-muted-foreground">
                                {o.shipping_address?.line1}
                                {o.shipping_address?.line2 ? `, ${o.shipping_address.line2}` : ""}
                              </div>
                              <div className="text-muted-foreground">
                                {o.shipping_address?.city}, {o.shipping_address?.state}{" "}
                                {o.shipping_address?.postal_code}
                              </div>
                              <div className="text-muted-foreground">{o.shipping_address?.country}</div>
                            </div>
                          </div>

                          <div>
                            <div className="mb-2 text-sm font-medium">Items</div>
                            <div className="divide-y rounded-md border text-sm">
                              {o.order_items?.map((it, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2">
                                  <div>
                                    {it.product_name}{" "}
                                    <span className="text-muted-foreground">× {it.quantity}</span>
                                  </div>
                                  <div>{formatINR(Number(it.line_total))}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                              <span className="text-muted-foreground">Shipping</span>
                              <span>{formatINR(Number(o.shipping_fee))}</span>
                            </div>
                            <div className="mt-1 flex justify-between font-semibold">
                              <span>Total</span>
                              <span>{formatINR(Number(o.total))}</span>
                            </div>
                          </div>

                          <div>
                            <div className="mb-2 text-sm font-medium">Tracking timeline</div>
                            <div className="space-y-2">
                              {(o.shipping_updates ?? []).map((u, i) => (
                                <div key={i} className="rounded-md border p-3 text-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium capitalize">{u.status}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(u.created_at).toLocaleString()}
                                    </div>
                                  </div>
                                  {u.location && <div className="text-xs text-muted-foreground">{u.location}</div>}
                                  {u.note && <div className="text-xs text-muted-foreground">{u.note}</div>}
                                </div>
                              ))}
                              {(o.shipping_updates ?? []).length === 0 && (
                                <div className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                                  No tracking updates yet
                                </div>
                              )}
                            </div>
                            <form onSubmit={addShippingUpdate} className="mt-3 space-y-2 rounded-md border bg-muted/30 p-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Status</Label>
                                  <Input
                                    required
                                    placeholder="Shipped"
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Location</Label>
                                  <Input
                                    placeholder="Mumbai Hub"
                                    value={updateForm.location}
                                    onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Note</Label>
                                <Textarea
                                  rows={2}
                                  placeholder="Optional details"
                                  value={updateForm.note}
                                  onChange={(e) => setUpdateForm({ ...updateForm, note: e.target.value })}
                                />
                              </div>
                              <Button type="submit" size="sm" disabled={updating}>
                                {updating ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Plus className="mr-2 h-4 w-4" />
                                )}
                                Add tracking update
                              </Button>
                            </form>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
