import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  initiatePhonePePayment,
  isPhonePeConfigured,
} from "@/lib/phonepe"
import type { ShippingAddress } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

type Body = {
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: ShippingAddress
  notes: string | null
  items: Array<{
    product_id: string
    product_name: string
    product_image: string | null
    unit_price: number
    quantity: number
  }>
  subtotal: number
  shipping_fee: number
  total: number
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body

    if (!body?.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to complete your order." },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // 🔥 STEP 1: Get or create UUID for Clerk user
    let dbUserId: string

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .maybeSingle()

    if (existingUser) {
      dbUserId = existingUser.id
    } else {
      const { data: newUser, error: userErr } = await supabase
        .from("users")
        .insert({ clerk_id: userId })
        .select("id")
        .single()

      if (userErr || !newUser) {
        return NextResponse.json(
          { error: userErr?.message || "Failed to create user" },
          { status: 500 }
        )
      }

      dbUserId = newUser.id
    }

    // ✅ STEP 2: Create order using UUID
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: dbUserId, // ✅ UUID now
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        shipping_address: body.shipping_address,
        subtotal: body.subtotal,
        shipping_fee: body.shipping_fee,
        total: body.total,
        notes: body.notes,
        payment_method: "phonepe",
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (orderErr || !order) {
      return NextResponse.json(
        { error: orderErr?.message || "Order creation failed" },
        { status: 500 }
      )
    }

    // rest of your code SAME ↓↓↓

    const orderItemsRows = body.items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product_name,
      product_image: i.product_image,
      unit_price: i.unit_price,
      quantity: i.quantity,
      line_total: i.unit_price * i.quantity,
    }))

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(orderItemsRows)

    if (itemsErr) {
      return NextResponse.json({ error: itemsErr.message }, { status: 500 })
    }

    const merchantTxnId = `MKG_${order.id.replace(/-/g, "").slice(0, 20)}`

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (req.headers.get("origin") ?? "http://localhost:3000")

    await supabase.from("payments").insert({
      order_id: order.id,
      merchant_txn_id: merchantTxnId,
      amount: body.total,
      currency: "INR",
      status: "pending",
    })

    if (!isPhonePeConfigured()) {
      await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_status: "paid",
          payment_txn_id: merchantTxnId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      return NextResponse.json({
        orderNumber: order.order_number,
        demo: true,
      })
    }

    const redirectUrl = `${siteUrl}/order/${order.order_number}`
    const callbackUrl = `${siteUrl}/api/phonepe/callback?order=${order.order_number}`

    const result = await initiatePhonePePayment({
      merchantTransactionId: merchantTxnId,
      amountInPaise: Math.round(body.total * 100),
      redirectUrl,
      callbackUrl,
      customerPhone: body.customer_phone ?? undefined,
    })

    const url = result?.data?.instrumentResponse?.redirectInfo?.url

    if (!result.success || !url) {
      return NextResponse.json(
        { error: result.message ?? "PhonePe init failed" },
        { status: 502 }
      )
    }

    return NextResponse.json({
      redirectUrl: url,
      orderNumber: order.order_number,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}