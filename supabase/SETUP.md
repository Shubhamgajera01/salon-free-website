
# Supabase connection — Phase 8

## 1. Create the database
Run:
- `database/schema.sql`
- `supabase/schema-v8.sql`

## 2. Configure the browser
Copy:
`supabase/config.example.js`
to:
`js/config.js`

Set:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Use the public anon/publishable key only.

## 3. Production security
Before opening the owner dashboard to the internet:
- Enable Supabase Auth.
- Create staff accounts.
- Add authenticated RLS policies for SELECT/UPDATE.
- Do not add a public SELECT policy on appointments.
- Do not expose a service-role key in HTML/JS.

## 4. Booking behavior
When configured:
Customer booking → Supabase `appointments` table.

When not configured:
Customer booking → local demo storage.

This fallback makes the project easy to demo before the real database is connected.
