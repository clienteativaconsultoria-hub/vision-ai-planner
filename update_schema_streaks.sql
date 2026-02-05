-- Adiciona colunas de gamificação na tabela profiles
alter table public.profiles 
add column if not exists current_streak integer default 0,
add column if not exists longest_streak integer default 0,
add column if not exists last_active_date date;

-- Política para permitir que o usuário atualize suas próprias estatísticas (já deve existir, mas reforçando)
-- create policy "Usuários podem atualizar seu próprio perfil" on public.profiles
--   for update using (auth.uid() = id);
