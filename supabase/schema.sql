

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  content text not null,
  created_at timestamptz not null default now()
);

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

