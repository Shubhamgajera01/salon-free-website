
# Phase 7 — Production data layer

## What is included
- PostgreSQL/Supabase-compatible appointments schema.
- Appointment statuses: pending, confirmed, completed, cancelled.
- Indexes for date, status and phone.
- `updated_at` trigger.
- Owner dashboard UI for the current browser-demo booking.
- Production security notes.

## What is deliberately NOT included
No database password, service-role key, admin credentials or private business contact information is stored in the website.

## Production architecture
Customer browser
→ secure API / Supabase client with RLS
→ appointments table
→ protected owner dashboard
→ notification provider (WhatsApp/email/SMS)

The public browser must never contain a Supabase service-role key.
