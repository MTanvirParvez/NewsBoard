-- ╔══════════════════════════════════════════════════╗
-- ║          LuminaBoard — Supabase Schema           ║
-- ╚══════════════════════════════════════════════════╝

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─── User Preferences ───────────────────────────────
create table if not exists public.user_preferences (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null unique,
  categories    text[] default array['politics','economy','tech_ai','industry','environment'],
  preferred_countries text[] default array[]::text[],
  ai_provider   text default 'openai' check (ai_provider in ('openai','anthropic','xai')),
  auto_refresh  boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.user_preferences enable row level security;

create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- ─── Articles ────────────────────────────────────────
create table if not exists public.articles (
  id            uuid primary key default uuid_generate_v4(),
  external_id   text unique not null,
  title         text not null,
  description   text,
  content       text,
  source_name   text not null,
  source_url    text,
  image_url     text,
  published_at  timestamptz not null,
  category      text not null check (category in ('politics','economy','tech_ai','industry','environment')),
  country       text,
  language      text default 'en',
  keywords      text[] default array[]::text[],
  sentiment_score float,
  user_id       uuid references auth.users(id) on delete cascade,
  created_at    timestamptz default now()
);

alter table public.articles enable row level security;

create policy "Users can view own articles"
  on public.articles for select
  using (auth.uid() = user_id);

create policy "Users can insert own articles"
  on public.articles for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own articles"
  on public.articles for delete
  using (auth.uid() = user_id);

create index idx_articles_category on public.articles(category);
create index idx_articles_published on public.articles(published_at desc);
create index idx_articles_user on public.articles(user_id);

-- ─── AI Summaries ────────────────────────────────────
create table if not exists public.summaries (
  id            uuid primary key default uuid_generate_v4(),
  article_id    uuid references public.articles(id) on delete cascade not null unique,
  bullets       text[] not null,
  sentiment     text not null check (sentiment in ('positive','negative','neutral')),
  sentiment_score float not null,
  topics        text[] default array[]::text[],
  region        text,
  created_at    timestamptz default now()
);

alter table public.summaries enable row level security;

create policy "Users can view summaries for own articles"
  on public.summaries for select
  using (
    exists (
      select 1 from public.articles
      where articles.id = summaries.article_id
      and articles.user_id = auth.uid()
    )
  );

create policy "Users can insert summaries for own articles"
  on public.summaries for insert
  with check (
    exists (
      select 1 from public.articles
      where articles.id = summaries.article_id
      and articles.user_id = auth.uid()
    )
  );

-- ─── Analytics Cache ─────────────────────────────────
create table if not exists public.analytics_cache (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null unique,
  data          jsonb not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.analytics_cache enable row level security;

create policy "Users can view own analytics"
  on public.analytics_cache for select
  using (auth.uid() = user_id);

create policy "Users can upsert own analytics"
  on public.analytics_cache for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analytics"
  on public.analytics_cache for update
  using (auth.uid() = user_id);

-- ─── Realtime ────────────────────────────────────────
alter publication supabase_realtime add table public.articles;
alter publication supabase_realtime add table public.analytics_cache;

-- ─── Functions ───────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_preferences (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
