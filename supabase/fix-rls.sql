-- ============================================================
-- Fix: remover policies com recursão infinita em profiles
-- A policy admin consultava profiles dentro de profiles → loop
-- Admin usa service_role key que bypassa RLS — policies não necessárias
-- ============================================================

-- Remover policies recursivas
drop policy if exists "admin sees all profiles"  on public.profiles;
drop policy if exists "admin manages all imoveis" on public.imoveis;
drop policy if exists "admin sees all leads"      on public.leads;

-- Criar função security definer para checar admin (evita recursão)
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

-- Recriar policies admin usando a função (sem recursão)
create policy "admin sees all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "admin manages all imoveis"
  on public.imoveis for all
  using (public.is_admin());

create policy "admin sees all leads"
  on public.leads for all
  using (public.is_admin());
