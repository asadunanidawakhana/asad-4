-- Allow Admins to View All Orders
CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow Admins to Update Orders (e.g., Status)
CREATE POLICY "Admins can update orders" 
ON orders FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow Admins to View All Order Items
CREATE POLICY "Admins can view all order items" 
ON order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
