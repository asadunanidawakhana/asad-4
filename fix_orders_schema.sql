-- Drop the Foreign Key pointing to auth.users (which is not accessible from client)
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add new Foreign Key pointing to public.profiles
-- This allows us to join/query user details from the frontend
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);
