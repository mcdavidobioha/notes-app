-- Run this in the Supabase SQL editor for your project.

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  content text not null,
  created_at timestamptz not null default now()
);

-- RLS is OFF by default even after policies exist below — this line is required.
alter table notes enable row level security;

create policy "Users can view own notes"
on notes for select
using (auth.uid() = user_id);

create policy "Users can insert own notes"
on notes for insert
with check (auth.uid() = user_id);

create policy "Users can update own notes"
on notes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own notes"
on notes for delete
using (auth.uid() = user_id);

-- Sanity check after creating policies:
-- select * from pg_policies where tablename = 'notes';
