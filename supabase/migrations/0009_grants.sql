-- GoCloudShop — restore standard Supabase baseline privilege grants.
--
-- Discovered in production: information_schema.role_table_grants had zero
-- rows for anon/authenticated/service_role on every public table, even
-- though schema USAGE and all RLS policies (0002_rls.sql) were correctly in
-- place. RLS only filters *which rows* a role can see once it already has
-- base table privileges — without the grants below, every query from the
-- anon key failed with "permission denied for table ..." before RLS was
-- ever evaluated, which is what caused /all-products (and every other
-- catalog page) to show zero results despite the catalog being fully
-- seeded.
--
-- This is the same baseline every new Supabase project gets automatically
-- from the platform's own bootstrap; it was missing here because the
-- schema was created via raw migrations rather than through Supabase's
-- normal project-init flow. Applying it does not change any table
-- structure, RLS policy, or data — RLS (already correct) remains the only
-- fine-grained access gate; these grants just restore the baseline the
-- existing RLS policies were written assuming was already present.
--
-- Safe to re-run: GRANT/ALTER DEFAULT PRIVILEGES are idempotent no-ops when
-- already applied.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant all privileges on all tables in schema public to service_role;

grant usage, select on all sequences in schema public to anon, authenticated, service_role;

grant execute on all functions in schema public to anon, authenticated, service_role;

-- So any table/sequence/function added by future migrations also gets the
-- correct grants automatically, matching standard Supabase project behavior.
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
