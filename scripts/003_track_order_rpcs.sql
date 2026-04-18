-- Public RPC functions so anonymous customers can look up their own orders by order_number
-- (orders themselves are admin-read-only via RLS, so we expose a narrow SECURITY DEFINER surface).

create or replace function public.track_order(p_order_number text)
returns public.orders
language sql stable security definer set search_path = public as $$
  select * from public.orders where order_number = p_order_number limit 1;
$$;

create or replace function public.track_order_items(p_order_number text)
returns setof public.order_items
language sql stable security definer set search_path = public as $$
  select oi.* from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where o.order_number = p_order_number
  order by oi.created_at asc;
$$;

create or replace function public.track_order_updates(p_order_number text)
returns setof public.shipping_updates
language sql stable security definer set search_path = public as $$
  select su.* from public.shipping_updates su
  join public.orders o on o.id = su.order_id
  where o.order_number = p_order_number
  order by su.created_at asc;
$$;

grant execute on function public.track_order(text) to anon, authenticated;
grant execute on function public.track_order_items(text) to anon, authenticated;
grant execute on function public.track_order_updates(text) to anon, authenticated;
