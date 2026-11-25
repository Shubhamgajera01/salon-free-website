
# Phase 14 — Performance + PWA + Launch

## Added
- Web App Manifest
- Service worker
- Browser caching for core pages
- Installable PWA metadata
- Theme color
- Mobile-first launch checklist

## Before production
1. Replace placeholder PWA icons with the salon's approved logo.
2. Use compressed WebP/AVIF salon photos.
3. Avoid loading unnecessary third-party scripts.
4. Keep remote images limited and optimized.
5. Test on a real Android phone and a slower mobile connection.
6. Run Lighthouse after the final content/images are added.
7. Confirm the final HTTPS domain before using service-worker caching.

## Important
The service worker uses absolute root paths. Deploy the website at the domain root.
If the site is deployed inside a subfolder, adjust the paths before enabling it.
