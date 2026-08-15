-- GoCloudShop — Storage buckets for admin-managed images.
-- Public read (so <Image> can load logos/product photos without auth),
-- staff-only write. Content-type/size are additionally validated
-- server-side in the upload server actions — storage policies alone are
-- not sufficient client-side validation.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('provider-logos', 'provider-logos', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('product-images', 'product-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('category-images', 'category-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "provider_logos_public_read" on storage.objects
  for select using (bucket_id = 'provider-logos');
create policy "provider_logos_staff_write" on storage.objects
  for insert with check (bucket_id = 'provider-logos' and is_staff());
create policy "provider_logos_staff_update" on storage.objects
  for update using (bucket_id = 'provider-logos' and is_staff());
create policy "provider_logos_staff_delete" on storage.objects
  for delete using (bucket_id = 'provider-logos' and is_staff());

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product_images_staff_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_staff());
create policy "product_images_staff_update" on storage.objects
  for update using (bucket_id = 'product-images' and is_staff());
create policy "product_images_staff_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and is_staff());

create policy "category_images_public_read" on storage.objects
  for select using (bucket_id = 'category-images');
create policy "category_images_staff_write" on storage.objects
  for insert with check (bucket_id = 'category-images' and is_staff());
create policy "category_images_staff_update" on storage.objects
  for update using (bucket_id = 'category-images' and is_staff());
create policy "category_images_staff_delete" on storage.objects
  for delete using (bucket_id = 'category-images' and is_staff());
