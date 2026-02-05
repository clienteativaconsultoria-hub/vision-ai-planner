-- Adiciona a coluna 'context' na tabela 'plans' para armazenar os dados do onboarding
alter table public.plans add column if not exists context jsonb;
