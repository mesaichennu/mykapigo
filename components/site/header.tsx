"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

// ✅ Clerk (fixed import)
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Buy From India" },
  { href: "/shipping", label: "Shipping" },
  { href: "/track", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  // ✅ Clerk user
  const { isSignedIn } = useUser()

  // ✅ Fix hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const safeCount = mounted ? count : 0

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="MyKapiGo logo" className="h-14 w-auto" />
          <span className="font-serif text-xl font-semibold tracking-tight">
            MyKapiGo
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((n) => {
            const active =
              pathname === n.href || pathname.startsWith(n.href + "/")
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm transition-colors hover:text-primary",
                  active ? "text-primary" : "text-foreground/75"
                )}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* ✅ Auth UI (fixed) */}
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}

          {/* Cart */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Cart, ${safeCount} items`}
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />

              {safeCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {safeCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}