
# Phase 10 — Notifications

The website now has a notification layer around appointments.

### Customer
- WhatsApp confirmation
- Email confirmation
- booking details in a reusable template

### Owner
- New appointment alert template
- Booking details formatted consistently

### Status
Reusable messages exist for:
- pending
- confirmed
- cancelled
- completed

### Important
The browser does NOT contain private WhatsApp/email provider credentials.
For automatic sending, use a Supabase Edge Function or another server-side service.

This keeps the public website safe while allowing real notification providers to be connected later.
