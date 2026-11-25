
# Phase 10 — Notification Architecture

The frontend now prepares notification content without exposing private provider credentials.

## Customer
After submitting:
- WhatsApp confirmation link is generated from the customer's phone number.
- Email confirmation uses a `mailto:` link when an email was provided.

## Owner
`InfinityNotifications.ownerAlert(booking)` creates a ready-to-send owner alert.

## Status messages
Templates are available for:
- pending
- confirmed
- cancelled
- completed

## Real automatic notifications

For a production deployment, automatic messages should NOT be sent directly from browser JavaScript using private API keys.

Recommended architecture:

Customer Browser
      ↓
Supabase / Edge Function
      ↓
Notification Provider
      ↓
WhatsApp / Email / SMS

Private provider secrets stay in the Edge Function environment.

Possible providers can be connected later for:
- WhatsApp Business messaging
- transactional email
- SMS/OTP

The website currently remains usable without any paid provider.
