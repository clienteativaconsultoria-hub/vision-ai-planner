-- Tabela de Metas (Goals)
create table if not exists public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('ativo', 'concluido')) default 'ativo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS para Goals
alter table public.goals enable row level security;

-- Políticas de Segurança para Goals
create policy "Usuários podem ver apenas suas próprias metas" on public.goals
  for select using (auth.uid() = user_id);

create policy "Usuários podem criar suas próprias metas" on public.goals
  for insert with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias metas" on public.goals
  for update using (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias metas" on public.goals
  for delete using (auth.uid() = user_id);
