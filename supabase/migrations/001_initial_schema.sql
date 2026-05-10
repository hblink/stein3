-- =============================================
-- Lumière E-Commerce Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (extends Supabase Auth users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  TO authenticated, anon
  USING (TRUE);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_price DECIMAL(10,2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  material TEXT,
  type TEXT CHECK (type IN ('necklace', 'bracelet', 'earring', 'ring', 'other')),
  images TEXT[] NOT NULL DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  TO authenticated, anon
  USING (TRUE);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'crafting', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_address TEXT,
  tracking_number TEXT,
  estimated_delivery TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- =============================================
-- ORDER STATUS HISTORY
-- =============================================
CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own order history"
  ON public.order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order history"
  ON public.order_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can insert order history"
  ON public.order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- SETTINGS
-- =============================================
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are publicly readable"
  ON public.settings FOR SELECT
  TO authenticated, anon
  USING (TRUE);

CREATE POLICY "Admins can manage settings"
  ON public.settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- AUDIT LOG
-- =============================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- HELPER: Auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- HELPER: Auto-log order status changes
-- =============================================
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, created_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER orders_status_log
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

-- =============================================
-- HELPER: Generate order number
-- =============================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  seq_num INTEGER;
  order_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(RIGHT(order_number, 6) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.orders
  WHERE order_number LIKE 'LUM-' || TO_CHAR(NOW(), 'YYYYMM') || '-%';

  order_num := 'LUM-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(seq_num::TEXT, 6, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SEED DATA: Categories
-- =============================================
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Necklaces', 'necklaces', 'Handcrafted necklaces made with sustainable materials', 1),
  ('Bracelets', 'bracelets', 'Beautiful bracelets crafted with care', 2),
  ('Earrings', 'earrings', 'Elegant earrings for every occasion', 3),
  ('Rings', 'rings', 'Unique rings made from recycled metals', 4);

-- =============================================
-- SEED DATA: Products
-- =============================================
INSERT INTO public.products (name, slug, description, price, compare_price, category_id, material, type, images, in_stock, featured, sort_order) VALUES
  ('Whispering Leaves', 'whispering-leaves', 'Delicate leaf pendants on a fine chain, each unique as nature itself.', 148.00, 178.00, (SELECT id FROM categories WHERE slug='necklaces'), 'Recycled Silver & Reclaimed Wood', 'necklace', '{}', TRUE, TRUE, 1),
  ('Golden Hour', 'golden-hour', 'Sun-kissed pendant that catches light like a meadow at dusk.', 195.00, NULL, (SELECT id FROM categories WHERE slug='necklaces'), 'Fair-Mined Gold & Recycled Glass', 'necklace', '{}', TRUE, TRUE, 2),
  ('Tide & Time', 'tide-and-time', 'Ocean-tumbled glass set in hand-forged silver, carrying the sea''s story.', 172.00, NULL, (SELECT id FROM categories WHERE slug='necklaces'), 'Recycled Silver & Sea Glass', 'necklace', '{}', TRUE, FALSE, 3),
  ('Earth & Ember', 'earth-and-ember', 'Warm copper curves cradling a garnet that glows like a campfire.', 225.00, 265.00, (SELECT id FROM categories WHERE slug='necklaces'), 'Reclaimed Copper & Ethical Garnet', 'necklace', '{}', TRUE, TRUE, 4),
  ('Woven Meadow', 'woven-meadow', 'Hand-woven threads in earth tones with sustainable glass accents.', 98.00, NULL, (SELECT id FROM categories WHERE slug='bracelets'), 'Organic Cotton & Recycled Beads', 'bracelet', '{}', TRUE, FALSE, 1),
  ('Moonstone Cuff', 'moonstone-cuff', 'A sculptural cuff with a moonstone that shifts with the light.', 165.00, NULL, (SELECT id FROM categories WHERE slug='bracelets'), 'Recycled Silver & Ethical Moonstone', 'bracelet', '{}', TRUE, TRUE, 2),
  ('Roots & Rings', 'roots-and-rings', 'Interlocking rings and natural beads — strength meets softness.', 120.00, NULL, (SELECT id FROM categories WHERE slug='bracelets'), 'Reclaimed Brass & Wooden Beads', 'bracelet', '{}', TRUE, FALSE, 3),
  ('River Stone', 'river-stone', 'A smooth river stone set in silver, worn by water over centuries.', 135.00, NULL, (SELECT id FROM categories WHERE slug='bracelets'), 'Recycled Silver & Polished River Stone', 'bracelet', '{}', TRUE, FALSE, 4);

-- =============================================
-- SEED DATA: Settings
-- =============================================
INSERT INTO public.settings (key, value) VALUES
  ('store_name', '"Lumière"'),
  ('store_description', '"Handmade sustainable jewellery crafted with loving care"'),
  ('currency', '"USD"'),
  ('shipping_free_threshold', '150'),
  ('shipping_rate', '12.00'),
  ('estimated_delivery_days', '14'),
  ('notifications_email', '"hello@lumiere.jewelry"'),
  ('store_open', 'true');
