import Link from "next/link"
import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { formatINR } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Package } from "lucide-react"

export const metadata = {
  title: "My orders | MyKapiGo",
}

type OrderRow = {
  id: string
  order_number: string
  status: string
  payment_status: string
  total: number
  currency: string
  created_at: string
  order_items: Array<{
    product_name: string
    quantity: number
    product_image: string | null
  }>
}

function statusTone(status: string) {
  switch (status) {
    case "paid":
    case "shipped":
    case "delivered":
      return "default" as const
    case "pending":
      return "secondary" as const
    case "cancelled":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

export default async function MyOrdersPage() {
  // ✅ Clerk auth
  const { userId } = await auth()

  if (!userId) {
    redirect("/account/sign-in?redirect=/account/orders")
  }

  const user = await currentUser()

  // ✅ Supabase (DB only)
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, payment_status, total, currency, created_at, order_items(product_name, quantity, product_image)"
    )
    .eq("user_id", userId) // ✅ IMPORTANT: Clerk userId
    .order("created_at", { ascending: false })

  const orders = (data ?? []) as OrderRow[]

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl">My orders</h1>
        </div>

        <Button asChild variant="outline">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>

      {error && (
        <p className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Could not load your orders: {error.message}
        </p>
      )}

      {orders.length === 0 ? (
        <div className="mt-10">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Package className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No orders yet</EmptyTitle>
              <EmptyDescription>
                When you place an order, it&apos;ll show up here with live tracking.
              </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
              <Button asChild>
                <Link href="/shop">Browse the store</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((order) => {
            const itemCount = order.order_items.reduce(
              (n, i) => n + i.quantity,
              0
            )
            const preview = order.order_items.slice(0, 4)

            return (
              <li
                key={order.id}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Order
                    </p>
                    <p className="font-mono text-sm">
                      {order.order_number}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placed{" "}
                      {new Date(order.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={statusTone(order.status)}
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>

                    <Badge variant="outline" className="capitalize">
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4">
                  <div className="flex -space-x-2">
                    {preview.map((it, idx) => (
                      <img
                        key={idx}
                        src={
                          it.product_image ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt=""
                        className="h-12 w-12 rounded-full border-2 border-background object-cover"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {itemCount} item{itemCount === 1 ? "" : "s"} &middot;{" "}
                    <span className="font-medium text-foreground">
                      {formatINR(order.total)}
                    </span>
                  </p>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                  >
                    <Link href={`/order/${order.order_number}`}>
                      View details
                    </Link>
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}