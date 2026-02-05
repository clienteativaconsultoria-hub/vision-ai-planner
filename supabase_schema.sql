-- Habilita a extensão para gerar UUIDs (se ainda não estiver habilitada)
create extension if not exists "uuid-ossp";

-- Tabela de Perfis (Profiles) - Vinculada ao Auth do Supabase
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS (Row Level Security) para Profiles
alter table public.profiles enable row level security;

-- Políticas de Segurança para Profiles
create policy "Perfis públicos são visíveis por todos" on public.profiles
  for select using (true);

create policy "Usuários podem inserir seu próprio perfil" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- Tabela de Planos (Plans)
create table if not exists public.plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  goal text not null,
  quarters jsonb not null,      -- Armazena a estrutura de trimestres (q1, q2, q3, q4)
  monthly_focus jsonb not null, -- Armazena array de focos mensais
  weekly_tactics jsonb not null,-- Armazena array de táticas semanais
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS para Plans
alter table public.plans enable row level security;

-- Políticas de Segurança para Plans
create policy "Usuários podem ver apenas seus próprios planos" on public.plans
  for select using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios planos" on public.plans
  for insert with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios planos" on public.plans
  for update using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios planos" on public.plans
  for delete using (auth.uid() = user_id);

-- Função para criar perfil automaticamente ao cadastrar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que dispara a função acima
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
