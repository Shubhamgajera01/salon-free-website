
# Phase 9 — Secure Staff Login

## A. Run SQL
Run `supabase/auth-and-rls-v9.sql` in Supabase SQL Editor.

## B. Create the first staff account
In Supabase:
Authentication → Users → Add user

Create the owner/staff email and password there.

## C. Link the Auth user to staff_profiles
Copy the Auth user's UUID and run:

insert into public.staff_profiles (user_id, full_name, role)
values ('YOUR-AUTH-USER-UUID', 'Salon Owner', 'owner');

## D. Configure the website
Copy:

supabase/config.example.js → js/config.js

Enter the project's public URL and anon/publishable key.

## E. Test
Open:
admin-login.html

Sign in with the Auth account.

The dashboard should reject:
- logged-out visitors
- Auth users not present in active staff_profiles

## Security rules
Never put:
- Supabase service-role key
- database password
- SMTP password
- private API secret

inside HTML, CSS or JavaScript files.

For a public production launch, add rate limiting/CAPTCHA or route public booking creation through a server-side Edge Function.
