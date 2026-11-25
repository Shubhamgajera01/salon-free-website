
-- Infinity The Family Salon
-- Phase 7 production-ready appointment data layer
-- PostgreSQL / Supabase compatible

create table if not exists public.appointments (
  appointment_id bigint generated always as identity primary key,
  booking_code varchar(20) not null unique,
  customer_name varchar(100) not null,
  phone varchar(15) not null,
  email varchar(150),
  audience varchar(20) not null check (audience in ('men','women','kids')),
  service_id varchar(20) not null,
  service_name varchar(100) not null,
  appointment_date date not null,
  appointment_time time not null,
  price numeric(10,2) not null default 0,
  duration_minutes integer,
  notes text,
  status varchar(20) not null default 'pending'
    check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointments_date
  on public.appointments(appointment_date);

create index if not exists idx_appointments_status
  on public.appointments(status);

create index if not exists idx_appointments_phone
  on public.appointments(phone);

-- Safe helper trigger to maintain updated_at.
create or replace function public.set_appointment_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists appointments_updated_at on public.appointments;

create trigger appointments_updated_at
before update on public.appointments
for each row execute function public.set_appointment_updated_at();

-- Example production query:
-- select * from public.appointments
-- where appointment_date = current_date
-- order by appointment_time;
