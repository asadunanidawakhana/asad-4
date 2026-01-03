-- 1. Create the 'prescriptions' Use Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for 'prescriptions'
CREATE POLICY "Public Access to Prescriptions"
ON storage.objects FOR SELECT
USING ( bucket_id = 'prescriptions' );

CREATE POLICY "Authenticated Users can upload Prescriptions"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'prescriptions' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update own Prescriptions"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'prescriptions' AND auth.uid() = owner );

CREATE POLICY "Users can delete own Prescriptions"
ON storage.objects FOR DELETE
USING ( bucket_id = 'prescriptions' AND auth.uid() = owner );

-- 3. Fix Prescriptions Table Foreign Key (to allow joining with profiles)
ALTER TABLE prescriptions 
DROP CONSTRAINT IF EXISTS prescriptions_user_id_fkey;

ALTER TABLE prescriptions 
ADD CONSTRAINT prescriptions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);
