-- ============================================================
-- VN Prime Imóveis — Supabase Schema
-- Execute no SQL Editor do Supabase
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid references auth.users on delete cascade primary key,
  email        text not null,
  nome         text,
  telefone     text,
  tipo         text not null default 'proprietario' check (tipo in ('proprietario','corretor','incorporadora','admin')),
  avatar_url   text,
  creci        text,
  plano        text check (plano in ('direta','assistida','completa')),
  plano_ativo  boolean not null default false,
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users manage own profile"
  on public.profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- Admin pode ver todos os perfis
create policy "admin sees all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.tipo = 'admin'));

-- Trigger: cria profile automaticamente no signup (Google OAuth ou email)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, nome, avatar_url, tipo)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'tipo', 'proprietario')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Imóveis ──────────────────────────────────────────────────
create table if not exists public.imoveis (
  id              uuid primary key default gen_random_uuid(),
  proprietario_id uuid references public.profiles(id) on delete set null,
  corretor_id     uuid references public.profiles(id) on delete set null,
  titulo          text not null,
  descricao       text,
  tipo            text not null check (tipo in ('apartamento','casa','cobertura','terreno','comercial','loja')),
  operacao        text not null check (operacao in ('venda','aluguel')),
  preco           numeric not null,
  area_m2         numeric,
  quartos         int,
  suites          int,
  banheiros       int,
  vagas           int,
  condominio      numeric,
  iptu            numeric,
  endereco        text,
  bairro          text,
  cidade          text not null default 'Belo Horizonte',
  estado          text not null default 'MG',
  cep             text,
  lat             numeric,
  lng             numeric,
  fotos           text[] not null default '{}',
  caracteristicas text[] not null default '{}',
  status          text not null default 'pendente' check (status in ('rascunho','pendente','ativo','pausado','vendido')),
  destaque        boolean not null default false,
  plano_label     text,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

alter table public.imoveis enable row level security;

-- Leitura pública para imóveis ativos
create policy "public reads ativo imoveis"
  on public.imoveis for select
  using (status = 'ativo');

-- Proprietário e corretor gerenciam seus imóveis
create policy "owners manage own imoveis"
  on public.imoveis for all
  using  (auth.uid() = proprietario_id or auth.uid() = corretor_id)
  with check (auth.uid() = proprietario_id or auth.uid() = corretor_id);

-- Admin gerencia tudo
create policy "admin manages all imoveis"
  on public.imoveis for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.tipo = 'admin'));

-- ── Leads ────────────────────────────────────────────────────
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  imovel_id       uuid references public.imoveis(id) on delete set null,
  corretor_id     uuid references public.profiles(id) on delete set null,
  proprietario_id uuid references public.profiles(id) on delete set null,
  nome            text not null,
  email           text not null,
  telefone        text,
  mensagem        text,
  origem          text,
  lido            boolean not null default false,
  criado_em       timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Qualquer um pode inserir lead (formulário de contato)
create policy "anyone can insert lead"
  on public.leads for insert
  with check (true);

-- Proprietário/corretor vê seus próprios leads
create policy "owners see own leads"
  on public.leads for select
  using (auth.uid() = proprietario_id or auth.uid() = corretor_id);

create policy "owners update own leads"
  on public.leads for update
  using (auth.uid() = proprietario_id or auth.uid() = corretor_id);

-- Admin vê todos
create policy "admin sees all leads"
  on public.leads for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.tipo = 'admin'));

-- ── Corretores ───────────────────────────────────────────────
create table if not exists public.corretores (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references public.profiles(id) on delete cascade unique,
  creci       text not null,
  especialidades text[] not null default '{}',
  bio         text,
  foto_url    text,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);

alter table public.corretores enable row level security;

create policy "corretor manages own record"
  on public.corretores for all
  using  (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "public reads active corretores"
  on public.corretores for select
  using (ativo = true);

-- ── Storage bucket: imoveis ───────────────────────────────────
-- Execute via Supabase Dashboard → Storage → New Bucket
-- Nome: imoveis | Public: true
-- Ou via SQL:
insert into storage.buckets (id, name, public)
values ('imoveis', 'imoveis', true)
on conflict (id) do nothing;

create policy "authenticated users upload imoveis"
  on storage.objects for insert
  with check (bucket_id = 'imoveis' and auth.role() = 'authenticated');

create policy "public reads imoveis storage"
  on storage.objects for select
  using (bucket_id = 'imoveis');

create policy "owners delete own imoveis files"
  on storage.objects for delete
  using (bucket_id = 'imoveis' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── Updated_at trigger ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger set_imoveis_updated_at
  before update on public.imoveis
  for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
