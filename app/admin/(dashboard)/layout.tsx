import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, email")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile?.is_admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({profile?.email ?? user.email}) is not an admin yet. Ask an existing admin to promote your
            account in Supabase:
          </p>
          <code className="mt-3 block rounded bg-muted p-2 text-left text-[11px] font-mono">
            {`update public.profiles set is_admin = true where email = '${profile?.email ?? user.email}';`}
          </code>
          <a
            href="/admin/login"
            className="mt-4 inline-block rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar email={profile.email ?? user.email ?? null} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
