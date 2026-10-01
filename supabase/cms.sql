-- Plane Architect CMS additions. Run after schema.sql.
-- Bootstrap an administrator by creating an Auth user, then inserting its UUID:
-- insert into public.admin_users (user_id) values ('<auth-user-uuid>');

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid());

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

alter table public.projects
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists hero_media_type text not null default 'image'
    check (hero_media_type in ('image', 'video'));

alter table public.news
  add column if not exists author text not null default 'Plane Architect',
  add column if not exists source_url text,
  add column if not exists body text not null default '',
  add column if not exists sort_order integer not null default 0,
  add column if not exists is_published boolean not null default true;

create table if not exists public.site_settings (
  singleton boolean primary key default true check (singleton),
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (singleton, settings)
values (true, '{}'::jsonb)
on conflict (singleton) do nothing;

create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  project_slug text references public.projects(slug) on update cascade on delete set null,
  author text not null,
  role text not null default '',
  quote text not null,
  image_url text not null default '',
  rating smallint not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_testimonials_project_slug on public.testimonials(project_slug);
create index if not exists idx_projects_sort_order on public.projects(sort_order);
create index if not exists idx_news_sort_order on public.news(sort_order);

alter table public.site_settings enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "Public read projects" on public.projects;
drop policy if exists "Public read news" on public.news;
drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects"
  on public.projects for select to anon, authenticated
  using (is_published);

drop policy if exists "Public read published news" on public.news;
create policy "Public read published news"
  on public.news for select to anon, authenticated
  using (is_published);

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings for select to anon, authenticated
  using (singleton);

drop policy if exists "Public read published testimonials" on public.testimonials;
create policy "Public read published testimonials"
  on public.testimonials for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
  on public.projects for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Admins manage news" on public.news;
create policy "Admins manage news"
  on public.news for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
  on public.site_settings for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
  on public.testimonials for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Admins read inquiries" on public.inquiries;
create policy "Admins read inquiries"
  on public.inquiries for select to authenticated
  using (public.is_site_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read site media" on storage.objects;
create policy "Public read site media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "Admins upload site media" on storage.objects;
create policy "Admins upload site media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Admins update site media" on storage.objects;
create policy "Admins update site media"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin())
  with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Admins delete site media" on storage.objects;
create policy "Admins delete site media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.is_site_admin());