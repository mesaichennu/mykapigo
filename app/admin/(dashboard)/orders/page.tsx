import { createSupabaseServerClient } from "@/lib/supabase/server"
import { OrdersManager } from "@/components/admin/orders-manager"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), shipping_updates(*)")
    .order("created_at", { ascending: false })

  return <OrdersManager orders={(data as any) ?? []} />
}
