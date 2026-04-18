import { createSupabaseServerClient } from "@/lib/supabase/server"
import { MessagesManager } from "@/components/admin/messages-manager"

export const dynamic = "force-dynamic"

export default async function AdminMessagesPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })
  return <MessagesManager messages={(data as any) ?? []} />
}
