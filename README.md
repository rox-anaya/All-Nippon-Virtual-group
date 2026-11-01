# All Nippon Virtual Group — Staged Website Build

This repository currently contains **Stage 1 (shared foundation) and Stage 2 (Home page)** of the ANVG rebuild. It is a real Next.js application with responsive public navigation, a working Home page, Supabase-backed Home content, a protected `/admin` entry point, database migrations, and setup instructions.

**This is not yet the finished website.** The remaining public pages show an intentional staged-build placeholder. Their full content and editing forms are not claimed as complete. The Admin Centre currently has a working Home & Site Settings editor; the other management modules are built in later stages.

## Technology

- Next.js App Router + TypeScript
- Tailwind CSS 4 foundation and custom responsive CSS
- Supabase PostgreSQL, Auth, Storage and Row Level Security
- `@supabase/ssr` cookie-based sessions
- Lucide icons
- Vercel deployment and GitHub source control

## Project structure

```text
anvg-platform/
├── public/                 # PWA manifest and app mark
├── src/
│   ├── app/                # Home, page routes, admin routes and global CSS
│   ├── components/         # Navigation, footer, admin forms and shared layouts
│   └── lib/                # Brand configuration and Supabase clients
├── supabase/
│   └── migrations/         # PostgreSQL schema, RLS and storage policies
├── docs/                   # Stage notes and checks
├── .env.example            # Safe environment-variable template
├── proxy.ts                # Supabase session refresh for Next.js 16
└── package.json
```

## 1. Supabase setup (Android-friendly)

1. Open the Supabase project in Chrome: <https://supabase.com/dashboard>.
2. Open **SQL Editor** from the left menu.
3. Select **New query**.
4. Open `supabase/migrations/202611010001_initial_anvg_foundation.sql` from the extracted project folder, copy all its contents, and paste them into the SQL Editor.
5. Press **Run**. Wait for the success result. The migration creates the content tables, Row Level Security policies, the `site-media` image bucket, and the initial site settings.
6. Open **Authentication → Settings** and turn off public sign-ups. Administrators are provisioned manually; visitors do not register through the website.
7. Open **Authentication → Users**. Create the administrator account using an email address you control. Set a password there, or use the Supabase recovery flow once email delivery is configured.
8. Open that user and copy the **User UID**. If the UUID you already supplied is visible as this account's UID, use that existing UID; otherwise use the UID of the administrator account you just created.
9. Return to **SQL Editor → New query** and run this statement after replacing the placeholder with the Auth User UID:

   ```sql
   insert into public.admin_users (user_id, display_name)
   values ('PASTE_AUTH_USER_UID_HERE', 'ANVG Administrator')
   on conflict (user_id) do update set is_active = true;
   ```

10. In **Authentication → URL Configuration**, set the Site URL to your eventual Vercel domain. Add these redirect URLs:
    - `https://YOUR-VERCEL-DOMAIN/admin/reset-password`
    - `http://localhost:3000/admin/reset-password` (for local testing)

The SQL migration intentionally creates **no public admin-registration path** and no policy that lets a signed-in user add themselves to `admin_users`.

### Image storage

The migration creates a public-read `site-media` bucket for website images. Only an authorised administrator can upload, replace or delete objects. Do not upload private documents or secrets to this bucket.

## 2. GitHub upload from Android

1. Download and extract the ZIP on your Android device.
2. Open <https://github.com/new> in Chrome and create a repository named `All-Nippon-Virtual-group` (or choose another name). Keep it private or public according to your preference.
3. Open the new repository and choose **Add file → Upload files**.
4. Select the extracted project files and folders from your Android file picker. Upload the project contents, not the ZIP archive itself. If your browser does not allow folder selection, use GitHub's web editor or upload the folder contents in smaller batches while preserving the directory structure.
5. Commit the uploaded files to the repository's `main` branch.

Do not upload `.env.local`, passwords, service-role keys, or any other secrets. The supplied Supabase publishable key is designed for client-side use, but it is still better to configure it as a Vercel environment variable rather than commit it to the repository.

## 3. Vercel deployment

1. Open <https://vercel.com> and sign in with GitHub.
2. Choose **Add New → Project**, then import `All-Nippon-Virtual-group`.
3. Vercel should detect Next.js automatically.
4. Before deploying, open **Environment Variables** and add:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key |

5. Leave the build command and output settings at their Next.js defaults.
6. Press **Deploy**.
7. After deployment, return to Supabase **Authentication → URL Configuration** and add the Vercel production domain and password-reset redirect URL.

No service-role key is required by the Stage 1 project. Never place a service-role key in a `NEXT_PUBLIC_` variable or browser code.

## 4. Admin access

- Open `https://YOUR-VERCEL-DOMAIN/admin` directly.
- Sign in with the email/password for the Auth user you inserted into `public.admin_users`.
- The dashboard is not linked from the public navigation or footer.
- The Home editor is available at `/admin/home` after signing in; it can also be opened from the Admin Centre overview.
- Other management modules are added stage by stage.
- An Auth user who is not in the admin allowlist cannot access the dashboard.
- Password recovery is available from the sign-in page once Supabase email delivery and redirect URLs are configured.

## 5. Local development (optional)

A PC is not required for the GitHub/Vercel workflow. If you later use a local development environment:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with your Supabase Project URL and publishable key. Open `http://localhost:3000`.

## 6. Stage 1 and Stage 2 implementation

- Public routes exist for Home, About, Staff, Pilots, Events, Fleet, Routes, Codeshare, Ranks, Training, Change Log, Settings and Apply.
- Shared navigation opens as a sliding panel, supports nested navigation and locks background scrolling while open.
- The footer uses only supplied community links; Instagram and VK remain hidden until configured.
- The developer menu credit displays **Anaya** and does not expose a personal IFC username. Its destination remains unset until configured by an administrator.
- `/admin` is not included in public navigation.
- `/admin/dashboard` checks both Supabase authentication and the `admin_users` allowlist on the server.
- Admin sign-in, password recovery and password update forms are wired to Supabase Auth.
- The Home page includes the supplied hero image, editable hero copy, statistics, three Operations Center links, Waypoints live map, editable mission and CEO message, five-image fleet carousel, and application CTA.
- The Home carousel advances every five seconds, loops, supports edge controls and touch swipes, and respects reduced-motion preferences.
- `/admin/home` edits Home copy, logo/hero images, numeric metrics, showcase uploads/replacement/removal/reordering, footer community URLs, and the Anaya menu-credit link.
- Home settings, metrics and showcase items are stored in Supabase; uploaded images use the `site-media` bucket.
- The public media bucket allows reads, but writes are restricted to administrators.
- The service worker is intentionally not enabled yet; PWA caching and update behaviour are implemented in the later PWA stage.

## 7. Verification performed

- The foundation validation script checks the expected files, all 12 public route shells, manifests, required schema tables, the developer credit, admin helper and private-username exclusion.
- TypeScript and TSX source files were parsed with the TypeScript compiler API for syntax errors.
- The ZIP archive is checked with `unzip -t` before delivery.
- A full Next.js production build, browser/device test, live Supabase migration, authentication test and upload test have **not** been run from this environment because project dependencies are not installed and this build session is not connected to your Supabase project. Do not treat those checks as passed.

## 8. Current limitations

1. Home is implemented, but About Us, Staff, Pilots, Events, Fleet, Routes, Codeshare, Ranks, Training, Change Log, Settings and Apply still need their dedicated page content and CRUD modules.
2. Supabase has not been connected from this build environment. Run the SQL migration and set the Vercel environment variables before testing live authentication or persistence.
3. Password recovery email delivery depends on Supabase Auth email configuration and the redirect allowlist.
4. The supplied Instagram, VK and developer-profile destinations were not provided, so those destinations remain blank rather than invented. They can be entered in `/admin/home`.
5. The Atlas Virtual roster text was adapted as an **ANVG Pilots** page because the requested website is ANVG. No Atlas Virtual brand or footer is mixed into this project.
6. Home metric values that were not supplied start at `0`; the four supplied Japanese hubs are represented by the initial Hubs value of `4`. Update the other values from `/admin/home` when the actual operational totals are available.

## 9. Security notes

- RLS is enabled on content tables.
- Public visitors can read only active, published rows.
- Content writes require an authenticated user for whom `public.is_admin()` returns true.
- `admin_users` has no user-facing insert, update or delete policy.
- Storage writes are administrator-only.
- Supabase sessions are cookie-backed and refreshed through `proxy.ts`.
- The admin page is `noindex` and absent from public navigation.
- No real passwords, service-role keys or private credentials are included in this repository.
