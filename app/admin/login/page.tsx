"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/admin")
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
          },
        })
        if (error) throw error
        toast.success("Account created. Ask an existing admin to promote your account via SQL before signing in.")
        setMode("sign-in")
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to site
          </Link>
          <CardTitle className="text-2xl">MyKapiGo Admin</CardTitle>
          <CardDescription>
            {mode === "sign-in" ? "Sign in to manage your store" : "Create an admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </Button>
            <button
              type="button"
              onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "sign-in" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
          </form>
          <p className="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            After sign-up, run this SQL in Supabase to make your account admin:
            <code className="mt-1 block break-all font-mono text-[11px]">
              update public.profiles set is_admin = true where email = &apos;you@example.com&apos;;
            </code>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
