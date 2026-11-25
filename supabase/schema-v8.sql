
-- Phase 8: Supabase/RLS setup
-- Run after database/schema.sql

alter table public.appointments enable row level security;

-- Public customers can INSERT appointment requests.
-- This policy intentionally allows inserts only; public users should not be
-- allowed to read or update everyone else's appointments.
drop policy if exists "public_can_create_appointments" on public.appointments;
create policy "public_can_create_appointments"
on public.appointments
for insert
to anon, authenticated
with check (
  status = 'pending'
  and length(trim(customer_name)) between 2 and 100
  and phone ~ '^[6-9][0-9]{9}$'
);

-- Staff access should be implemented through authenticated staff accounts.
-- Add a staff table/role system before enabling SELECT/UPDATE policies.
-- Do NOT create a public SELECT policy for appointments.

-- Example secure direction:
-- create policy "staff_can_read_appointments"
-- on public.appointments for select to authenticated
-- using ((auth.jwt() ->> 'role') = 'staff');
