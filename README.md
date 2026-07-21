# Notes App — Next.js + Supabase (RLS)

A minimal notes app where signed-in users can create and list notes scoped
to their own user id via Postgres Row Level Security. Auth is handled with
Supabase magic links; no passwords stored or managed by this app.

## Stack

- Next.js 15 (App Router, TypeScript)
- Supabase (Postgres + Auth)
- @supabase/ssr for cookie-based session sync across server/client
- Tailwind CSS

## Setup

1. Create a project at https://supabase.com if you don't have one.

2. Run `supabase/schema.sql` in the Supabase SQL editor. This creates the
   `notes` table, enables RLS, and adds four policies (select/insert/update/delete)
   that scope every row to `auth.uid()`.

3. Copy `.env.local.example` to `.env.local` and fill in your project's URL
   and PUBLISHABLE_KEY key (Project Settings → API in the Supabase dashboard):

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

4. Install and run:

   ```
   pnpm install
   pnpm run dev
   ```

5. Visit `http://localhost:3000`, sign in with an email (magic link), and
   you'll land on `/notes`.



## Verifying isolation manually

Open two browser sessions (e.g. a normal window and an incognito window),
sign in as two different email addresses, and confirm each only ever sees
its own notes — including after adding/deleting in one session while the
other is open.
