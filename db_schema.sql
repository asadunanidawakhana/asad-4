-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text,
  created_at timestamp DEFAULT now()
);

-- Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  stock_quantity int DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  sku text,
  slug text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Orders Table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  total numeric NOT NULL,
  status text DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  shipping_address jsonb,
  payment_method text DEFAULT 'cod',
  created_at timestamp DEFAULT now()
);

-- Order Items Table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity int NOT NULL,
  price numeric NOT NULL -- Snapshot of price at time of order
);

-- Prescriptions Table
CREATE TABLE prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  file_url text NOT NULL,
  status text DEFAULT 'pending', -- pending, approved, rejected
  notes text,
  created_at timestamp DEFAULT now()
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  duration text, -- e.g., '1 month', '3 months'
  features text[],
  created_at timestamp DEFAULT now()
);

-- User Subscriptions (Active subscriptions)
CREATE TABLE user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  subscription_id uuid REFERENCES subscriptions(id),
  start_date timestamp DEFAULT now(),
  end_date timestamp,
  status text DEFAULT 'active'
);

-- Blogs Table
CREATE TABLE blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  author_id uuid REFERENCES auth.users(id),
  image text,
  created_at timestamp DEFAULT now()
);

-- Wishlist Table
CREATE TABLE wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  created_at timestamp DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Support Tickets
CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open', -- open, closed, in-progress
  created_at timestamp DEFAULT now()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Categories & Products & Blogs & Subscriptions (Public Read, Admin Write)
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Subscriptions" ON subscriptions FOR SELECT USING (true);

-- Orders (User can read own, Admin can read all)
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
-- (Admin policies usually handled by service_role or specific admin flag in users table, but for simplicity assuming checking a metadata field or similar. 
-- For now, basic user RLS)

-- Prescriptions (User own read/create)
CREATE POLICY "Users can read own prescriptions" ON prescriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload prescriptions" ON prescriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlist
CREATE POLICY "Users manage wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Storage Buckets Setup (instructions - needs to be done in dashboard)
-- images
-- prescriptions

-- Addresses Table
CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  zip_code text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own addresses" ON addresses 
  FOR ALL USING (auth.uid() = user_id);


-- Profiles Table (Publicly visible user info for admin/etc)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'customer',
  created_at timestamp DEFAULT now()
);

-- RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger using the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

