import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatINR } from "@/lib/format"
import { ShoppingBag, Inbox, Package, MessageSquare, IndianRupee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()

  const [productsRes, ordersRes, requestsRes, contactsRes, paidOrdersRes, recentOrdersRes] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("service_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contacts").select("*", { count: "exact", head: true }).eq("handled", false),
    supabase.from("orders").select("total").eq("payment_status", "paid"),
    supabase
      .from("orders")
      .select("id, order_number, customer_name, total, status, payment_status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ])

  const revenue = (paidOrdersRes.data ?? []).reduce((sum, o: any) => sum + Number(o.total), 0)

  const stats = [
    { label: "Revenue", value: formatINR(revenue), icon: IndianRupee },
    { label: "Orders", value: ordersRes.count ?? 0, icon: ShoppingBag },
    { label: "Products", value: productsRes.count ?? 0, icon: Package },
    { label: "New Requests", value: requestsRes.count ?? 0, icon: Inbox },
    { label: "New Messages", value: contactsRes.count ?? 0, icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 text-xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent orders</CardTitle>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {(recentOrdersRes.data ?? []).length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No orders yet</div>
            ) : (
              (recentOrdersRes.data ?? []).map((o: any) => (
                <Link
                  key={o.id}
                  href={`/admin/orders`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/50"
                >
                  <div>
                    <div className="font-medium">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.customer_name} &middot; {new Date(o.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatINR(Number(o.total))}</div>
                    <div className="text-xs capitalize text-muted-foreground">
                      {o.status} &middot; {o.payment_status}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
