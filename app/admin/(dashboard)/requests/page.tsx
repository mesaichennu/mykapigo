import { createSupabaseServerClient } from "@/lib/supabase/server"
import { RequestsManager } from "@/components/admin/requests-manager"

export const dynamic = "force-dynamic"

export default async function AdminRequestsPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false })
  return <RequestsManager requests={(data as any) ?? []} />
}
