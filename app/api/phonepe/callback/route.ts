import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyPhonePeCallback } from "@/lib/phonepe"

/**
 * PhonePe server-to-server callback. Body is a JSON object containing a
 * base64-encoded `response` field. The X-VERIFY header authenticates the call.
 */
export async function POST(req: Request) {
  try {
    const checksum = req.headers.get("x-verify") ?? ""
    const payload = (await req.json()) as { response?: string }
    const base64 = payload?.response ?? ""

    if (!base64 || !checksum || !verifyPhonePeCallback(base64, checksum)) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 })
    }

    const decoded = JSON.parse(Buffer.from(base64, "base64").toString("utf-8")) as {
      code?: string
      data?: {
        merchantTransactionId?: string
        transactionId?: string
        state?: string
      }
    }

    const merchantTxnId = decoded?.data?.merchantTransactionId
    const providerTxnId = decoded?.data?.transactionId
    const paid = decoded?.code === "PAYMENT_SUCCESS"

    if (!merchantTxnId) {
      return NextResponse.json({ ok: false, error: "Missing txn id" }, { status: 400 })
    }

    const supabase = await createClient()

    await supabase
      .from("payments")
      .update({
        status: paid ? "paid" : "failed",
        provider_txn_id: providerTxnId,
        raw_response: decoded,
      })
      .eq("merchant_txn_id", merchantTxnId)

    const { data: payment } = await supabase
      .from("payments")
      .select("order_id")
      .eq("merchant_txn_id", merchantTxnId)
      .maybeSingle()

    if (payment?.order_id) {
      await supabase
        .from("orders")
        .update({
          payment_status: paid ? "paid" : "failed",
          status: paid ? "paid" : "pending",
          payment_txn_id: providerTxnId ?? merchantTxnId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.order_id)

      if (paid) {
        await supabase.from("shipping_updates").insert({
          order_id: payment.order_id,
          status: "Order confirmed",
          location: "Bengaluru, India",
          note: "Payment received. Preparing for dispatch.",
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
