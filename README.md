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
   and anon key (Project Settings → API in the Supabase dashboard):

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Install and run:

   ```
   npm install
   npm run dev
   ```

5. Visit `http://localhost:3000`, sign in with an email (magic link), and
   you'll land on `/notes`.

## How RLS is enforced here

- `notes.user_id` defaults to `auth.uid()` and every policy checks
  `auth.uid() = user_id`, both when reading (`using`) and writing
  (`with check`).
- The **anon key** is used on both the client and the server — that key
  has no special privileges beyond a normal browser client. The database,
  not the app, is what stops one user from seeing or modifying another
  user's notes. Enforcement is identical whether the query originates
  from a Server Component, a client component, or an external API call.
- The `with check` clause on the UPDATE policy is easy to skip and easy
  to miss in review: without it, `using` alone would let a user update a
  row they own but reassign its `user_id` to someone else, since `using`
  only filters which existing rows are visible, not what values the write
  can produce.

## Verifying isolation manually

Open two browser sessions (e.g. a normal window and an incognito window),
sign in as two different email addresses, and confirm each only ever sees
its own notes — including after adding/deleting in one session while the
other is open.
