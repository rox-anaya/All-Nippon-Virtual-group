-- ANVG foundation schema
-- Apply once in Supabase SQL Editor. No service-role key is required by this project.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'ANVG Administrator',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.is_active = true
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  site_name text not null default 'All Nippon Virtual Group',
  brand_logo_url text not null default 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1792817398/file_0000000014488211bfa6f947add0e395_npjxai.png',
  home_hero_image_url text not null default 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1779014897/Screenshot_20260509_221234_com.fds.infiniteflight_ewqhzv.jpg',
  home_hero_alt_text text not null default 'ANVG virtual aviation aircraft in flight',
  home_hero_label text not null default 'ANVG • Waypoints Community Airline',
  site_subtitle text not null default 'The Spirit of Japanese Aviation • Official Community Airline on Waypoints',
  tagline text not null default 'Fly Beyond Borders',
  about_description text not null default '',
  mission_text text not null default 'To turn every flight into a journey worth remembering. ANVG brings together aviators to explore, connect, and experience virtual flight operations through the spirit of Japan. We fly with purpose, grow as a community, and leave a mark on every route we take.',
  ceo_message text not null default 'Welcome to ANVG. We’re here to make every flight meaningful, every destination memorable, and every pilot part of something greater. Let’s fly together and build something we can be proud of.',
  ceo_name text not null default 'Luciano',
  ceo_role text not null default 'CEO - All Nippon Virtual Group',
  footer_disclaimer text not null default 'All Nippon Virtual Group is not affiliated with the real-world All Nippon Airways or ANA Holdings. All trademarks and logos remain the property of their respective owners.',
  footer_regional_credit text not null default 'Proudly Indian & Kannadiga',
  footer_waypoints_url text not null default 'https://waypoint-live.app/va/all-nippon-virtual-airways/apply',
  footer_instagram_url text,
  footer_youtube_url text not null default 'https://youtube.com/@anavirtualgroup?si=-nIMOqYuDvfR663Y',
  footer_vk_url text,
  menu_powered_by text not null default 'POWERED BY METUPOLO™',
  menu_developer_name text not null default 'Anaya',
  menu_button_label text not null default 'Waypoints VA',
  menu_button_url text,
  application_test_url text not null default 'https://forms.gle/VsEM8PW3DT9u9hk88',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true)
on conflict (id) do nothing;

create table if not exists public.home_statistics (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null unique,
  label text not null,
  value text not null default '0',
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_showcase (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  image_url text not null,
  alt_text text not null default 'ANVG aircraft showcase image',
  object_position text not null default 'center',
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists home_showcase_image_url_unique on public.home_showcase (image_url);

insert into public.home_statistics (metric_key, label, value, display_order)
values
  ('flight_hours', 'Flight Hours Flown', '0', 1),
  ('total_pireps', 'Total PIREPs', '0', 2),
  ('hubs', 'Hubs', '4', 3),
  ('aircraft_family', 'Aircraft Family', '0', 4),
  ('destinations', 'Destinations', '0', 5)
on conflict (metric_key) do nothing;

insert into public.home_showcase (title, image_url, alt_text, display_order)
values
  ('ANVG Fleet 01', 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574373/InfiniteFlight_2026-09-27-13-11-43_c2obn9.webp', 'ANVG virtual airline aircraft showcase one', 1),
  ('ANVG Fleet 02', 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-46_tbcdxz.webp', 'ANVG virtual airline aircraft showcase two', 2),
  ('ANVG Fleet 03', 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-15_cmvok8.webp', 'ANVG virtual airline aircraft showcase three', 3),
  ('ANVG Fleet 04', 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-38_fj7ej7.webp', 'ANVG virtual airline aircraft showcase four', 4),
  ('ANVG Fleet 05', 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-19_oor104.webp', 'ANVG virtual airline aircraft showcase five', 5)
on conflict (image_url) do nothing;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  banner_url text,
  banner_position text not null default 'center',
  departure_icao varchar(4) not null check (departure_icao ~ '^[A-Z]{4}$'),
  arrival_icao varchar(4) not null check (arrival_icao ~ '^[A-Z]{4}$'),
  departure_at timestamptz not null,
  display_order integer not null default 0,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  banner_url text,
  banner_position text not null default 'center',
  display_order integer not null default 0,
  published_at timestamptz not null default now(),
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.operating_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icao varchar(4) check (icao is null or icao ~ '^[A-Z]{4}$'),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  location_type text not null default 'destination' check (location_type in ('hub', 'destination', 'other')),
  is_primary_hub boolean not null default false,
  display_order integer not null default 0,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.operational_routes (
  id uuid primary key default gen_random_uuid(),
  route_name text not null default '',
  origin_location_id uuid not null references public.operating_locations(id) on delete restrict,
  destination_location_id uuid not null references public.operating_locations(id) on delete restrict,
  airline_division_id uuid,
  notes text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint operational_routes_distinct_locations check (origin_location_id <> destination_location_id)
);

create table if not exists public.operational_hubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icao varchar(4) not null check (icao ~ '^[A-Z]{4}$'),
  description text not null default '',
  image_url text,
  image_position text not null default 'center',
  location_id uuid references public.operating_locations(id) on delete set null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.airline_divisions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default '',
  description text not null default '',
  logo_url text,
  brand_color text not null default '#7fc2ff',
  hub_icaos text[] not null default '{}',
  fleet_types text[] not null default '{}',
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.operational_routes
  drop constraint if exists operational_routes_airline_division_id_fkey;
alter table public.operational_routes
  add constraint operational_routes_airline_division_id_fkey
  foreign key (airline_division_id) references public.airline_divisions(id) on delete set null;

create table if not exists public.aircraft (
  id uuid primary key default gen_random_uuid(),
  division_id uuid not null references public.airline_divisions(id) on delete restrict,
  name text not null,
  model text not null default '',
  description text not null default '',
  image_url text,
  category text not null default 'Passenger' check (category in ('Passenger', 'Cargo')),
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.codeshare_partners (
  id uuid primary key default gen_random_uuid(),
  airline_name text not null,
  logo_url text,
  description text not null default '',
  aircraft_information text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  role_name text not null unique,
  color_config jsonb not null default '{"background":"rgba(127,194,255,0.08)","border":"#416b8d","label":"#9fd2ff","glow":"none"}'::jsonb,
  hierarchy_priority integer not null default 100,
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_id uuid references public.staff_roles(id) on delete set null,
  description text not null default '',
  profile_image_url text,
  color_override jsonb,
  button_label text,
  button_url text,
  button_visible boolean not null default false,
  display_order integer not null default 0,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pilot_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pilot_id text not null unique,
  rank_name text not null default 'Trainee',
  flight_hours numeric(12,2) not null default 0 check (flight_hours >= 0),
  profile_image_url text,
  ifc_profile_url text,
  display_order integer not null default 0,
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pilot_ranks (
  id uuid primary key default gen_random_uuid(),
  rank_name text not null,
  description text not null default '',
  insignia_url text,
  minimum_hours numeric(12,2) not null default 0 check (minimum_hours >= 0),
  maximum_hours numeric(12,2) check (maximum_hours is null or maximum_hours >= minimum_hours),
  rank_category text not null default 'standard' check (rank_category in ('standard', 'elite')),
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_page_settings (
  id boolean primary key default true check (id = true),
  page_title text not null default 'Pilot Training & Evaluation',
  page_description text not null default '',
  evaluation_heading text not null default 'Evaluation Stages',
  recruitment_heading text not null default 'Recruitment Flow',
  cta_heading text not null default 'Ready to take off?',
  cta_description text not null default '',
  cta_button_label text not null default 'Go to Application',
  cta_destination text not null default '/apply',
  is_published boolean not null default true,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.training_page_settings (id) values (true) on conflict (id) do nothing;

create table if not exists public.training_stages (
  id uuid primary key default gen_random_uuid(),
  stage_number integer not null default 1,
  title text not null,
  description text not null default '',
  assessment_information text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recruitment_steps (
  id uuid primary key default gen_random_uuid(),
  step_number integer not null default 1,
  title text not null,
  description text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.change_log_entries (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  description text not null default '',
  display_order integer not null default 0,
  published_at timestamptz not null default now(),
  is_published boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_announcements (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  announcement_text text not null default '',
  is_enabled boolean not null default false,
  is_published boolean not null default true,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.application_prerequisites (
  id uuid primary key default gen_random_uuid(),
  item_number integer not null default 1,
  heading text not null,
  description text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.application_steps (
  id uuid primary key default gen_random_uuid(),
  step_number integer not null default 1,
  heading text not null default '',
  description text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated-at trigger shared by content tables.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enable RLS and create a public-read/admin-write policy pair for published content.
do $$
declare
  table_name text;
  content_tables text[] := array[
    'home_statistics', 'home_showcase', 'events', 'news_items',
    'operating_locations', 'operational_routes', 'operational_hubs',
    'airline_divisions', 'aircraft', 'codeshare_partners', 'staff_roles',
    'staff_members', 'pilot_profiles', 'pilot_ranks', 'training_stages',
    'recruitment_steps', 'change_log_entries', 'page_announcements',
    'application_prerequisites', 'application_steps'
  ];
begin
  foreach table_name in array content_tables loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_public_read', table_name);
    execute format('create policy %I on public.%I for select to anon, authenticated using (is_published = true and is_active = true)', table_name || '_public_read', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_admin_manage', table_name);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name || '_admin_manage', table_name);
    execute format('drop trigger if exists %I on public.%I', table_name || '_updated_at', table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', table_name || '_updated_at', table_name);
  end loop;
end $$;

alter table public.site_settings enable row level security;
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (id = true);
drop policy if exists site_settings_admin_manage on public.site_settings;
create policy site_settings_admin_manage on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.training_page_settings enable row level security;
drop policy if exists training_page_settings_public_read on public.training_page_settings;
create policy training_page_settings_public_read on public.training_page_settings for select to anon, authenticated using (is_published = true and is_active = true);
drop policy if exists training_page_settings_admin_manage on public.training_page_settings;
create policy training_page_settings_admin_manage on public.training_page_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop trigger if exists training_page_settings_updated_at on public.training_page_settings;
create trigger training_page_settings_updated_at before update on public.training_page_settings for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
drop policy if exists admin_users_read_self on public.admin_users;
create policy admin_users_read_self on public.admin_users for select to authenticated using (user_id = auth.uid() or public.is_admin());
-- Deliberately no INSERT, UPDATE, or DELETE policy for admin_users.

-- Public read-only media bucket. Upload, replace and delete are admin-only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "ANVG public media read" on storage.objects;
create policy "ANVG public media read" on storage.objects for select to anon, authenticated using (bucket_id = 'site-media');
drop policy if exists "ANVG admin media insert" on storage.objects;
create policy "ANVG admin media insert" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "ANVG admin media update" on storage.objects;
create policy "ANVG admin media update" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "ANVG admin media delete" on storage.objects;
create policy "ANVG admin media delete" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());

create table if not exists public.application_page_settings (
  id boolean primary key default true check (id = true),
  page_title text not null default 'Join Our Flight Deck',
  page_description text not null default '',
  waypoints_heading text not null default 'Waypoints Integration',
  waypoints_description text not null default '',
  intake_small_heading text not null default 'Crew Center Direct Intake',
  intake_main_heading text not null default 'Start Your Pilot Test',
  intake_description text not null default '',
  divider_text text not null default 'Take Pilot Test on Waypoints',
  button_label text not null default 'Start Pilot Test',
  destination_url text not null default 'https://forms.gle/VsEM8PW3DT9u9hk88',
  is_published boolean not null default true,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.application_page_settings (id) values (true) on conflict (id) do nothing;
alter table public.application_page_settings enable row level security;
drop policy if exists application_page_settings_public_read on public.application_page_settings;
create policy application_page_settings_public_read on public.application_page_settings for select to anon, authenticated using (is_published = true and is_active = true);
drop policy if exists application_page_settings_admin_manage on public.application_page_settings;
create policy application_page_settings_admin_manage on public.application_page_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop trigger if exists application_page_settings_updated_at on public.application_page_settings;
create trigger application_page_settings_updated_at before update on public.application_page_settings for each row execute function public.set_updated_at();

-- Helpful indexes for public ordering and common admin lookups.
create index if not exists events_public_schedule_idx on public.events (departure_at) where is_published = true and is_active = true;
create index if not exists news_public_order_idx on public.news_items (published_at desc) where is_published = true and is_active = true;
create index if not exists locations_public_order_idx on public.operating_locations (display_order) where is_published = true and is_active = true;
create index if not exists routes_public_order_idx on public.operational_routes (display_order) where is_published = true and is_active = true;
create index if not exists aircraft_public_order_idx on public.aircraft (division_id, display_order) where is_published = true and is_active = true;
create index if not exists pilots_leaderboard_idx on public.pilot_profiles (flight_hours desc) where is_published = true and is_active = true;
create index if not exists staff_hierarchy_idx on public.staff_members (display_order) where is_published = true and is_active = true;

-- Supabase SQL Editor creates these tables in the public schema. Explicit grants
-- make the intended role access clear; RLS still decides which rows are visible.
grant usage on schema public to anon, authenticated;
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant select on public.training_page_settings, public.application_page_settings to anon, authenticated;
grant insert, update, delete on public.training_page_settings, public.application_page_settings to authenticated;
grant select on public.admin_users to authenticated;
do $$
declare
  table_name text;
  content_tables text[] := array[
    'home_statistics', 'home_showcase', 'events', 'news_items',
    'operating_locations', 'operational_routes', 'operational_hubs',
    'airline_divisions', 'aircraft', 'codeshare_partners', 'staff_roles',
    'staff_members', 'pilot_profiles', 'pilot_ranks', 'training_stages',
    'recruitment_steps', 'change_log_entries', 'page_announcements',
    'application_prerequisites', 'application_steps'
  ];
begin
  foreach table_name in array content_tables loop
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
  end loop;
end $$;
