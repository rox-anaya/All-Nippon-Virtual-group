# Stage 2 status — Home page

## Implemented

- Supplied Home foreground image with proportion-preserving sizing.
- Editable hero label, group title and tagline.
- Three Home hero actions: Events, Learn More and Join Fleet.
- Five informational statistics, stored in `home_statistics` and editable from Admin Centre.
- Operations Center with exactly three links: Pilots, Routes and Codeshare.
- Waypoints live map iframe, Online indicator and fallback portal link.
- Supplied Our Mission copy, editable in the Admin Centre.
- Five-image Fleet Showcase using the supplied Cloudinary images, one image at a time, five-second autoplay, continuous looping, previous/next edge controls, touch swipe and reduced-motion handling.
- Editable carousel entries with image upload, removal and move-up/move-down ordering.
- Supplied CEO message, name and role, all editable.
- Join CTA linking to Apply.
- Header logo, footer community links, footer disclaimer/credit and hamburger developer credit are stored as public site settings and editable through the Home & Site Settings panel.
- Admin upload preview, 20 MB per-image validation, Supabase Storage upload, persisted database records and destructive-action confirmation for removals.

## Admin entry points

- `/admin` — secure sign-in (not linked publicly).
- `/admin/dashboard` — protected overview.
- `/admin/home` — Home and global site settings editor.

## Initial data

The SQL migration seeds the five supplied showcase images and the five requested statistics. Flight hours, PIREPs, aircraft-family count and destinations default to `0` until the administrator supplies actual values. Hubs starts at `4`, based on the four supplied Japanese hubs.

## Not yet implemented

All non-Home page modules and their dedicated admin CRUD interfaces, the interactive 3D globe, visitor-local theme/font/voice settings, service worker caching, PWA update handling and final cross-device runtime testing.
