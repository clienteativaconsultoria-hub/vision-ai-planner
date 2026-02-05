-- Adiciona a coluna 'completed_tactics' na tabela 'plans' para armazenar os índices das tarefas concluídas
alter table public.plans add column if not exists completed_tactics jsonb default '[]'::jsonb;
