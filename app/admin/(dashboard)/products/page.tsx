import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ProductManager } from "@/components/admin/product-manager"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient()
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(id, slug, name)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("sort_order"),
  ])

  return <ProductManager products={(products as any) ?? []} categories={(categories as any) ?? []} />
}
