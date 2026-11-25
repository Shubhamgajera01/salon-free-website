
-- PHASE 9: STAFF AUTHENTICATION + RLS
-- Run this AFTER database/schema.sql and supabase/schema-v8.sql.
--
-- Supabase Auth manages login credentials. staff_profiles maps an Auth user
-- to the website's staff/owner role.

create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name varchar(100) not null,
  role varchar(20) not null default 'staff'
    check (role in ('owner','staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;

drop policy if exists "staff_can_read_own_profile" on public.staff_profiles;
create policy "staff_can_read_own_profile"
on public.staff_profiles
for select
to authenticated
using (user_id = auth.uid());

-- Helper function for appointment policies.
create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles
    where user_id = auth.uid()
      and active = true
  );
$$;

revoke all on function public.is_active_staff() from public;
grant execute on function public.is_active_staff() to authenticated;

-- Staff can read appointments.
drop policy if exists "active_staff_can_read_appointments" on public.appointments;
create policy "active_staff_can_read_appointments"
on public.appointments
for select
to authenticated
using (public.is_active_staff());

-- Staff can update appointment status/details.
drop policy if exists "active_staff_can_update_appointments" on public.appointments;
create policy "active_staff_can_update_appointments"
on public.appointments
for update
to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

-- Staff do not need to create appointments from the dashboard.
-- Customer INSERT policy remains from Phase 8.

-- IMPORTANT:
-- Create the first Auth user from Supabase Dashboard > Authentication.
-- Then insert that user's UUID into staff_profiles.
-- Never put the user's password or service-role key in website files.
