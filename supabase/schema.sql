-- ProjectPilot AI - Supabase schema
-- Run this once in your Supabase project's SQL Editor (Database > SQL Editor > New query).
-- Requires Google provider enabled under Authentication > Providers.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'New Project',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  role text not null check (role in ('user', 'ai')),
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_project_id_idx on public.messages(project_id);
create index if not exists projects_user_id_idx on public.projects(user_id);

-- Row Level Security: a user can only ever see/modify their own projects
-- and the messages that belong to their own projects. The anon key used
-- in the frontend is safe to expose publicly *because* of these policies.
alter table public.projects enable row level security;
alter table public.messages enable row level security;

create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

create policy "Users can view messages in their own projects"
  on public.messages for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = messages.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can add messages to their own projects"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = messages.project_id
      and projects.user_id = auth.uid()
    )
  );