import crypto from "crypto"

/**
 * Minimal PhonePe Standard Checkout helper (sandbox + production).
 * Docs: https://developer.phonepe.com/v1/reference/pay-api-1
 *
 * When PHONEPE_MERCHANT_ID / PHONEPE_SALT_KEY are not configured, the
 * initiate endpoint falls back to a local demo flow so the app runs
 * end-to-end without real credentials.
 */

export type PhonePeInitiateInput = {
  merchantTransactionId: string
  amountInPaise: number
  redirectUrl: string
  callbackUrl: string
  customerPhone?: string
}

export function getPhonePeConfig() {
  const merchantId = process.env.PHONEPE_MERCHANT_ID
  const saltKey = process.env.PHONEPE_SALT_KEY
  const saltIndex = process.env.PHONEPE_SALT_INDEX ?? "1"
  const host =
    process.env.PHONEPE_HOST ??
    "https://api-preprod.phonepe.com/apis/pg-sandbox"
  return { merchantId, saltKey, saltIndex, host }
}

export function isPhonePeConfigured() {
  const { merchantId, saltKey } = getPhonePeConfig()
  return Boolean(merchantId && saltKey)
}

export async function initiatePhonePePayment(input: PhonePeInitiateInput) {
  const { merchantId, saltKey, saltIndex, host } = getPhonePeConfig()
  if (!merchantId || !saltKey) {
    throw new Error("PhonePe is not configured")
  }

  const payload = {
    merchantId,
    merchantTransactionId: input.merchantTransactionId,
    amount: input.amountInPaise,
    redirectUrl: input.redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: input.callbackUrl,
    mobileNumber: input.customerPhone,
    paymentInstrument: { type: "PAY_PAGE" },
  }

  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64")
  const path = "/pg/v1/pay"
  const checksum =
    crypto.createHash("sha256").update(base64 + path + saltKey).digest("hex") +
    "###" +
    saltIndex

  const res = await fetch(host + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "X-VERIFY": checksum,
    },
    body: JSON.stringify({ request: base64 }),
  })

  const data = await res.json()
  return data as {
    success: boolean
    data?: { instrumentResponse?: { redirectInfo?: { url?: string } } }
    message?: string
  }
}

export function verifyPhonePeCallback(
  responseBase64: string,
  headerChecksum: string,
) {
  const { saltKey, saltIndex } = getPhonePeConfig()
  if (!saltKey) return false
  const expected =
    crypto.createHash("sha256").update(responseBase64 + saltKey).digest("hex") +
    "###" +
    saltIndex
  return expected === headerChecksum
}
