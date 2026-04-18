export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  image_url: string | null
  sort_order: number
  created_at: string
}

export type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  currency: string
  category_id: string | null
  image_url: string | null
  gallery: string[]
  stock: number
  is_active: boolean
  featured: boolean
  created_at: string
  updated_at: string
  category?: Pick<Category, "id" | "slug" | "name"> | null
}

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image_url: string | null
  quantity: number
}

export type ShippingAddress = {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: ShippingAddress
  subtotal: number
  shipping_fee: number
  total: number
  currency: string
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string | null
  payment_txn_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  unit_price: number
  quantity: number
  line_total: number
  created_at: string
}

export type ServiceRequest = {
  id: string
  customer_name: string
  email: string
  country: string
  whatsapp: string | null
  product_name: string
  product_link: string | null
  product_description: string | null
  quantity: number
  budget: number | null
  currency: string
  shipping_destination: string
  notes: string | null
  status: "new" | "quoted" | "approved" | "sourcing" | "shipped" | "closed"
  created_at: string
}

export type Contact = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  handled: boolean
  created_at: string
}

export type ShippingUpdate = {
  id: string
  order_id: string
  status: string
  location: string | null
  note: string | null
  created_at: string
}
