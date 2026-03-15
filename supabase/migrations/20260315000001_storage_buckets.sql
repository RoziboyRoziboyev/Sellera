-- Insert Storage Buckets
insert into storage.buckets (id, name, public) values ('product_images', 'product_images', true);
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false);

-- Policies for product_images
create policy "Public Access to product_images" on storage.objects for select using ( bucket_id = 'product_images' );
create policy "Authenticated users can upload product_images" on storage.objects for insert with check ( bucket_id = 'product_images' and auth.role() = 'authenticated' );

-- Policies for receipts
create policy "Users can view own receipts" on storage.objects for select using ( bucket_id = 'receipts' and auth.uid() = owner );
create policy "Users can upload own receipts" on storage.objects for insert with check ( bucket_id = 'receipts' and auth.uid() = owner );
create policy "SuperAdmin can view all receipts" on storage.objects for select using ( bucket_id = 'receipts' and public.is_super_admin() );
