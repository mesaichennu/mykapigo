import type { Metadata, Viewport } from "next"
import { Ubuntu, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: {
    default: "MyKapiGo — Authentic Indian products, delivered worldwide",
    template: "%s · MyKapiGo",
  },
  description:
    "Shop authentic Indian handicrafts, textiles, spices and wellness. Or request any product from India with our Buy From India concierge service.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#faf6ed",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased">
        <ClerkProvider>
          <CartProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster richColors position="top-right" />
          </CartProvider>
          {process.env.NODE_ENV === "production" && <Analytics />}
        </ClerkProvider>
      </body>
    </html>
  )
}