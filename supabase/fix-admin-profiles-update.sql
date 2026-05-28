-- ============================================================
-- Fix: admin precisa de permissão UPDATE em profiles
-- A policy "admin sees all profiles" só dá SELECT.
-- Sem essa policy, trocar tipo de usuário no painel admin falha silenciosamente.
-- ============================================================

-- Garante que a função is_admin() existe (criada em fix-rls.sql)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and tipo = 'admin'
  );
$$;

-- Permissão completa de admin em profiles (select + update + delete)
drop policy if exists "admin manages all profiles" on public.profiles;
create policy "admin manages all profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());
