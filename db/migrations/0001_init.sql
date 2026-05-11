create extension if not exists "pgcrypto";

create type event_type as enum (
  'call_start', 'call_end', 'booking', 'ride',
  'faq', 'dispatch', 'sms_owner', 'sms_driver',
  'error', 'other'
);

create table drivers (
  id                 uuid        primary key default gen_random_uuid(),
  name               text        not null,
  phone              text        not null unique,
  zone               text        not null,
  is_available       boolean     not null default true,
  last_dispatched_at timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index drivers_zone_avail_idx
  on drivers (zone, is_available, last_dispatched_at nulls first);

create table events (
  id           uuid        primary key default gen_random_uuid(),
  call_sid     text,
  caller_phone text,
  caller_name  text,
  type         event_type  not null,
  details      jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index events_call_sid_idx  on events (call_sid);
create index events_type_time_idx on events (type, created_at desc);

create table bookings (
  id                uuid        primary key default gen_random_uuid(),
  caller_name       text        not null,
  caller_phone      text        not null,
  pickup            text        not null,
  dropoff           text        not null,
  scheduled_at      timestamptz,
  is_immediate      boolean     not null default false,
  status            text        not null default 'pending',
  calendar_event_id text,
  driver_id         uuid        references drivers(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index bookings_scheduled_idx on bookings (scheduled_at);
create index bookings_driver_idx    on bookings (driver_id);
create index bookings_status_idx    on bookings (status);

create table call_sessions (
  call_sid     text        primary key,
  caller_phone text,
  state        text        not null,
  data         jsonb       not null default '{}'::jsonb,
  attempts     int         not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  expires_at   timestamptz not null default now() + interval '30 minutes'
);
create index call_sessions_expires_idx on call_sessions (expires_at);

create table faqs (
  id         uuid    primary key default gen_random_uuid(),
  question   text    not null,
  keywords   text[]  not null,
  answer     text    not null,
  audio_hash text,
  is_active  boolean not null default true
);

create table audio_assets (
  hash       text primary key,
  text       text not null,
  voice_id   text not null,
  model_id   text not null,
  file_path  text,
  bytes      int,
  created_at timestamptz not null default now()
);

create or replace function tg_set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$
begin new.updated_at = now(); return new; end $$;

create trigger drivers_updated_at
  before update on drivers for each row execute function tg_set_updated_at();
create trigger bookings_updated_at
  before update on bookings for each row execute function tg_set_updated_at();
create trigger sessions_updated_at
  before update on call_sessions for each row execute function tg_set_updated_at();

-- Atomically claim the best available driver for a zone (same zone first, then any)
create or replace function claim_driver(p_zone text)
returns setof drivers language plpgsql
set search_path = public
as $$
declare
  v_driver drivers;
begin
  -- Try same zone first
  update drivers set is_available = false, last_dispatched_at = now()
  where id = (
    select id from drivers
    where is_available = true and zone = p_zone
    order by last_dispatched_at nulls first
    limit 1
    for update skip locked
  )
  returning * into v_driver;

  if found then return next v_driver; return; end if;

  -- Fall back to any available driver
  update drivers set is_available = false, last_dispatched_at = now()
  where id = (
    select id from drivers
    where is_available = true
    order by last_dispatched_at nulls first
    limit 1
    for update skip locked
  )
  returning * into v_driver;

  if found then return next v_driver; end if;
end $$;

alter table drivers       enable row level security;
alter table events        enable row level security;
alter table bookings      enable row level security;
alter table call_sessions enable row level security;
alter table faqs          enable row level security;
alter table audio_assets  enable row level security;
