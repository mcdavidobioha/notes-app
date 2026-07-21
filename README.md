# Notes App — Next.js + Supabase (RLS)

A full-stack notes app built with Next.js App Router, Tailwind CSS, and Supabase. Signed-in users can create, edit, list, and delete notes scoped strictly to their user ID via PostgreSQL Row Level Security (RLS). Authentication is handled via Email & Password using Supabase Auth.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Database & Auth**: Supabase (Postgres + Supabase Auth)
- **Session Sync**: `@supabase/ssr` with Next.js Proxy Middleware
- **Server Architecture**: Centralized Next.js Server Actions (`server/actions/`)
- **Styling**: Tailwind CSS

---

## ✨ Features

- 🔐 **Password Authentication**: Email and password Sign In and Sign Up.
- 📝 **Full CRUD Notes**: Create, view, edit inline, and delete personal notes.
- 🛡️ **Row Level Security (RLS)**: Enforced directly at the database level so users can only access their own notes (`auth.uid() = user_id`).
- 🚀 **Server Actions**: All database mutations and auth requests run through Server Actions for maximum security and cookie handling.
- 🔄 **Route Protection**: Centralized Proxy middleware ([proxy.ts] automatically redirects unauthenticated users to `/login`.
- 👤 **User Email Callout**: Displays the authenticated user's email directly on the `/notes` dashboard.

---

## 📁 Project Structure

```text
notes-app/
├── app/
│   ├── login/
│   │   ├── components/Auth.tsx     # Client-side Auth component (Sign In / Sign Up)
│   │   └── page.tsx
│   └── notes/
│       ├── components/NotesClient.tsx # Client component for notes UI & inline editing
│       └── page.tsx                # Server Component reading initial notes & session
├── proxy.ts                        # Next.js Proxy middleware for session refresh & route protection
├── server/
│   ├── server.ts                   # Supabase server client factory (createServerClient)
│   └── actions/
│       ├── auth.ts                 # Server actions for signIn, signUp, and signOut
│       └── notes.ts                # Server actions for addNote, updateNote, deleteNote
└── supabase/
    └── schema.sql                  # Database table definition & RLS policies
```

---

## 🚀 Setup Instructions

### 1. Create Supabase Project
Create a project at [supabase.com](https://supabase.com) if you haven't already.

### 2. Run Database Schema
Execute the SQL script in [supabase/schema.sql] using the Supabase SQL Editor. This script:
- Creates the `notes` table with a foreign key referencing `auth.users(id)`.
- Enables Row Level Security (`alter table notes enable row level security;`).
- Creates policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` scoped to `auth.uid() = user_id`.

### 3. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and add your Supabase credentials (found in **Project Settings → API** in your Supabase dashboard):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 4. Install & Run Locally

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` in your browser. Unauthenticated requests will automatically route to `/login`, and signing in will land you on `/notes`.

---

## 🔒 How RLS Is Enforced

1. `notes.user_id` defaults to `auth.uid()`.
2. Every Postgres policy checks `auth.uid() = user_id` for both reading (`using`) and writing (`with check`).
3. Database requests are made via `@supabase/ssr` server clients, ensuring auth tokens stored in cookies are validated directly by PostgreSQL on every query.
