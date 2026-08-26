-- ============================================================================
-- 3 Studio — Supabase schema
-- ============================================================================
-- Run this ONCE in your Supabase project's SQL Editor (Dashboard -> SQL
-- Editor -> New query -> paste this whole file -> Run). It is safe to run
-- more than once (uses "if not exists" / "on conflict do nothing").
--
-- What this creates:
--   1. A "products" table — the single source of truth for everything shown
--      in the shop (3D prints + neon signs).
--   2. Row Level Security (RLS) so that:
--        - ANYONE (including logged-out visitors) can READ products — the
--          public storefront needs this to show the catalog.
--        - ONLY a logged-in user (you or your partner, once you create your
--          two accounts under Authentication -> Users) can add, edit or
--          delete products.
--   3. A storage bucket named "product-images" for photo uploads from the
--      admin panel, world-readable but only writable while logged in.
--   4. The current catalog, pre-loaded as starter rows, so nothing on the
--      live site changes until you actually edit something in the admin
--      panel.
-- ============================================================================

create table if not exists public.products (
  id text primary key,
  type text not null check (type in ('3d', 'neon')),
  category text not null default '',
  name text not null,
  price numeric(10,3),
  purchase_type text not null default 'direct' check (purchase_type in ('direct', 'quote')),
  customizable boolean not null default false,
  featured boolean not null default false,
  rating numeric(2,1) not null default 5.0,
  reviews integer not null default 0,
  images text[] not null default '{}',
  colors text[] not null default '{}',
  materials text[] not null default '{}',
  neon_colors text[] not null default '{}',
  description text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "Public can view products" on public.products;
create policy "Public can view products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "Logged-in users can add products" on public.products;
create policy "Logged-in users can add products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "Logged-in users can edit products" on public.products;
create policy "Logged-in users can edit products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Logged-in users can delete products" on public.products;
create policy "Logged-in users can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for product photos uploaded from the admin panel
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Logged-in users can upload product images" on storage.objects;
create policy "Logged-in users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Logged-in users can update product images" on storage.objects;
create policy "Logged-in users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Logged-in users can delete product images" on storage.objects;
create policy "Logged-in users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ---------------------------------------------------------------------------
-- Starter catalog (the products already live on the site today)
-- ---------------------------------------------------------------------------
insert into public.products
  (id, type, category, name, price, purchase_type, customizable, featured, rating, reviews, images, colors, materials, neon_colors, description, tags)
values
('deck-box-01', '3d', 'deck-boxes', 'Custom Trading Card Deck Box', 12, 'direct', true, true, 4.9, 38, ARRAY['assets/3d/deck-boxes/deck-box-01.jpg', 'assets/3d/deck-boxes/deck-box-02.jpg', 'assets/3d/deck-boxes/deck-box-03.jpg']::text[], ARRAY['Black', 'White', 'Orange', 'Grey', 'Custom']::text[], ARRAY['PLA', 'PETG']::text[], '{}', 'A precision 3D-printed deck box for trading card games — sized for double-sleeved cards, with a magnetic-friction lid and clean layer-free finish. Add your own name or logo for a personal touch.', ARRAY['deck box', 'cards', 'gaming', 'storage']::text[]),
('car-phone-holder', '3d', 'car', 'Custom Car Phone Holder', 8, 'direct', true, true, 4.7, 21, ARRAY['assets/3d/car/car-phone-holder-01.jpg', 'assets/3d/car/car-phone-holder-02.jpg']::text[], ARRAY['Black', 'Grey', 'Custom']::text[], ARRAY['PETG', 'TPU']::text[], '{}', 'A vent- or dash-mounted phone holder, custom-fitted to your vehicle and phone size for a snug, rattle-free grip.', ARRAY['car', 'phone holder', 'accessory']::text[]),
('car-cup-organizer', '3d', 'car', 'Car Cup Holder Organizer', 6.5, 'direct', false, false, 4.6, 14, ARRAY['assets/3d/car/car-cup-organizer-01.jpg']::text[], ARRAY['Black', 'Grey']::text[], ARRAY['PLA', 'PETG']::text[], '{}', 'Keep loose coins, cards and small items organized in your cup holder instead of rolling around the cabin.', ARRAY['car', 'organizer']::text[]),
('car-interior-clip', '3d', 'car', 'Custom Car Interior Clip', 3, 'direct', true, false, 4.5, 9, ARRAY['assets/3d/car/car-interior-clip-01.jpg']::text[], ARRAY['Black']::text[], ARRAY['Nylon', 'PETG']::text[], '{}', 'Replacement clips and small interior fasteners, reverse-engineered and reprinted for your exact vehicle.', ARRAY['car', 'replacement part']::text[]),
('controller-stand', '3d', 'gaming', 'Gaming Controller Stand', 7.5, 'direct', true, true, 4.8, 27, ARRAY['assets/3d/gaming/controller-stand-01.jpg', 'assets/3d/gaming/controller-stand-02.jpg']::text[], ARRAY['Black', 'White', 'Orange', 'Custom']::text[], ARRAY['PLA', 'PETG']::text[], '{}', 'A clean desk stand for your controller with cable pass-through and a stable weighted base.', ARRAY['gaming', 'controller', 'desk']::text[]),
('headphone-stand', '3d', 'gaming', 'Headphone Stand', 9, 'direct', true, false, 4.9, 33, ARRAY['assets/3d/gaming/headphone-stand-01.jpg']::text[], ARRAY['Black', 'White', 'Orange', 'Grey', 'Custom']::text[], ARRAY['PLA', 'PETG']::text[], '{}', 'A sturdy headset stand with optional name plate on the base — built to hold weight without tipping.', ARRAY['gaming', 'headphones', 'desk']::text[]),
('cable-organizer', '3d', 'organizers', 'Cable Management Organizer', 4, 'direct', false, false, 4.4, 12, ARRAY['assets/3d/office/cable-organizer-01.jpg']::text[], ARRAY['Black', 'White']::text[], ARRAY['PLA']::text[], '{}', 'Modular clips to route and tidy desk cables — chargers, monitor cables and peripherals kept in place.', ARRAY['desk', 'organizer', 'cables']::text[]),
('name-plate', '3d', 'office', 'Custom Name Plate', 5.5, 'direct', true, false, 4.7, 18, ARRAY['assets/3d/office/name-plate-01.jpg']::text[], ARRAY['Black', 'White', 'Orange', 'Custom']::text[], ARRAY['PLA', 'PETG']::text[], '{}', 'A desk or door name plate with raised or engraved text, finished in your choice of color.', ARRAY['office', 'desk', 'gift']::text[]),
('dashboard-accessory', '3d', 'car', 'Custom Dashboard Accessory', 6, 'quote', true, false, 4.6, 7, ARRAY['assets/3d/car/dashboard-accessory-01.jpg']::text[], ARRAY['Black', 'Custom']::text[], ARRAY['PETG', 'TPU']::text[], '{}', 'One-off dashboard accessories designed around your make, model and year — send us photos or measurements.', ARRAY['car', 'custom part']::text[]),
('neon-gaming-controller', 'neon', 'gaming', 'Gaming Controller Neon', 25, 'direct', true, true, 4.9, 16, ARRAY['assets/neon/gaming/neon-controller-01.jpg', 'assets/neon/gaming/neon-controller-02.jpg']::text[], '{}', '{}', ARRAY['Purple', 'Cyan', 'Pink', 'Blue']::text[], 'A wall-mounted controller-shaped neon sign for gaming rooms and setups. Fully configurable text, size and color.', ARRAY['neon', 'gaming', 'controller']::text[]),
('neon-custom-name', 'neon', 'custom-text', 'Custom Gamer Name', 20, 'direct', true, true, 5, 41, ARRAY['assets/neon/gaming/neon-gamer-name-01.jpg']::text[], '{}', '{}', ARRAY['Orange', 'Cyan', 'Purple', 'Pink', 'Cool White']::text[], 'Your name or gamertag, custom-shaped in neon. Choose the font, size, color and mounting style.', ARRAY['neon', 'custom text', 'name']::text[]),
('neon-business-logo', 'neon', 'business-logos', 'Business Logo Neon', NULL, 'quote', true, false, 4.8, 11, ARRAY['assets/neon/business/neon-business-logo-01.jpg']::text[], '{}', '{}', ARRAY['Orange', 'Warm White', 'Cool White', 'Custom']::text[], 'Your company logo recreated as an illuminated neon sign for reception areas, storefronts and offices.', ARRAY['neon', 'business', 'logo']::text[]),
('neon-restaurant-wall', 'neon', 'cafes-restaurants', 'Restaurant Wall Logo', NULL, 'quote', true, false, 4.7, 8, ARRAY['assets/neon/cafe/neon-restaurant-wall-01.jpg']::text[], '{}', '{}', ARRAY['Warm White', 'Orange', 'Red', 'Custom']::text[], 'A statement wall piece for restaurants — logo, tagline or signature dish name in glowing neon.', ARRAY['neon', 'restaurant', 'wall art']::text[]),
('neon-cafe-quote', 'neon', 'cafes-restaurants', 'Café Neon Quote', 35, 'direct', true, false, 4.8, 19, ARRAY['assets/neon/cafe/neon-cafe-quote-01.jpg']::text[], '{}', '{}', ARRAY['Warm White', 'Pink', 'Yellow']::text[], 'A cozy custom quote or phrase in neon script, perfect for café interiors and photo corners.', ARRAY['neon', 'cafe', 'quote']::text[]),
('neon-office-reception', 'neon', 'offices', 'Office Reception Logo', NULL, 'quote', true, false, 4.9, 6, ARRAY['assets/neon/office/neon-office-reception-01.jpg']::text[], '{}', '{}', ARRAY['Cool White', 'Orange', 'Cyan', 'Custom']::text[], 'A minimal, premium logo sign for reception walls — built to match your brand guidelines.', ARRAY['neon', 'office', 'logo']::text[]),
('neon-exhibition-booth', 'neon', 'events', 'Exhibition Booth Logo', NULL, 'quote', true, false, 4.6, 5, ARRAY['assets/neon/events/neon-exhibition-booth-01.jpg']::text[], '{}', '{}', ARRAY['Custom']::text[], 'Lightweight, freestanding or hanging neon signage built for exhibition booths and pop-up events.', ARRAY['neon', 'events', 'booth']::text[]),
('neon-wedding-name', 'neon', 'weddings', 'Custom Wedding Name', 30, 'direct', true, false, 5, 23, ARRAY['assets/neon/wedding/neon-wedding-name-01.jpg']::text[], '{}', '{}', ARRAY['Warm White', 'Pink', 'Cool White']::text[], 'Elegant script neon featuring the couple''s names — a statement backdrop for weddings and engagement events.', ARRAY['neon', 'wedding', 'event']::text[])
on conflict (id) do nothing;
