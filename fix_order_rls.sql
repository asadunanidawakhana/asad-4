-- Allow authenticated users to insert into orders table
CREATE POLICY "Users can create orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to insert into order_items table
-- checking that the associated order belongs to them
CREATE POLICY "Users can insert order items" 
ON order_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Allow authenticated users to read their own order items
CREATE POLICY "Users can read own order items" 
ON order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);
