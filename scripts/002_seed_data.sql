-- Seed categories and a set of demo products
insert into public.categories (slug, name, description, sort_order) values
  ('return-gifts', 'Return Gifts', 'Thoughtful traditional return gifts for every occasion.', 1),
  ('gruhapravesham', 'Gruhapravesham', 'Auspicious items for housewarming ceremonies.', 2),
  ('kondapalli-toys', 'Kondapalli Toys', 'Handcrafted wooden toys from Kondapalli, Andhra Pradesh.', 3),
  ('pooja-items', 'Pooja Items', 'Authentic brass and silver items for daily worship.', 4),
  ('gift-combos', 'Gift Combos', 'Curated bundles that celebrate Indian heritage.', 5)
on conflict (slug) do nothing;

insert into public.products (slug, name, description, price, currency, category_id, image_url, stock, featured)
select
  v.slug, v.name, v.description, v.price, 'INR',
  c.id, v.image_url, v.stock, v.featured
from (values
  ('silk-thamboolam-set',    'Silk Thamboolam Set (Pack of 10)', 'Elegant silk pouches filled with traditional thamboolam essentials. Perfect for weddings and seemantham.', 2499.00, 'return-gifts',    '/silk-thamboolam-pouches.jpg', 40, true),
  ('brass-kumkum-box',       'Brass Kumkum Box Set',             'Hand-polished brass kumkum and haldi boxes. An elegant return gift.',                                   899.00,  'return-gifts',    '/brass-kumkum-boxes.jpg', 60, false),
  ('mango-leaf-toran',       'Mango Leaf Toran',                 'Auspicious doorway toran crafted in brass and silk threads.',                                         649.00,  'gruhapravesham',  '/mango-leaf-toran-brass.jpg', 80, true),
  ('copper-kalash',          'Copper Kalash with Coconut Stand', 'Traditional copper kalash set for housewarming rituals.',                                             1799.00, 'gruhapravesham',  '/copper-kalash-coconut.jpg', 35, true),
  ('kondapalli-dasavatar',   'Kondapalli Dasavatara Set',        'Handcrafted wooden Dasavatara figurines — a timeless heirloom.',                                      3499.00, 'kondapalli-toys', '/kondapalli-wooden-dasavatara.jpg', 15, true),
  ('kondapalli-bullock',     'Kondapalli Bullock Cart',          'Playful bullock-cart figurine painted in earthy tones.',                                              1299.00, 'kondapalli-toys', '/kondapalli-bullock-cart-wooden-toy.jpg', 22, false),
  ('panchaloha-deepam',      'Panchaloha Deepam',                'Five-metal oil lamp that brings warmth and devotion to daily pooja.',                                 2199.00, 'pooja-items',     '/panchaloha-brass-oil-lamp.jpg', 30, true),
  ('silver-pooja-plate',     'Silver-Plated Pooja Thali',        'Handcrafted pooja thali with diya, bell, kumkum bowls and agarbatti stand.',                          2899.00, 'pooja-items',     '/silver-pooja-thali.jpg', 25, false),
  ('welcome-home-combo',     'Welcome Home Gift Combo',          'Curated housewarming bundle with toran, kalash, sweets and brass diyas.',                             3999.00, 'gift-combos',     '/welcome-home-gift-combo.jpg', 18, true),
  ('festive-mithai-combo',   'Festive Mithai & Pooja Combo',     'Premium mithai tin paired with pooja essentials in a gift box.',                                      2499.00, 'gift-combos',     '/festive-mithai-pooja-combo.jpg', 50, false)
) as v(slug, name, description, price, cat_slug, image_url, stock, featured)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;
