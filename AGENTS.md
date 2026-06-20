**Purpose**: Short, actionable instructions to help AI coding agents and contributors work productively in this repo.

- **Root scripts**: See [package.json](package.json#L1) and run `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`.
- **Backend**: See [backend/package.json](backend/package.json#L1). Backend dev/build: `npm --prefix backend install`, `npm --prefix backend run prisma:generate`, `npm --prefix backend run start:dev`.

- **Key files**:
  - **Frontend entry**: [app/page.tsx](app/page.tsx#L1)
  - **Backend entry**: [backend/src/main.ts](backend/src/main.ts#L1)
  - **Prisma schema**: [backend/prisma/schema.prisma](backend/prisma/schema.prisma#L1)
  - **Supabase client**: [lib/supabase.ts](lib/supabase.ts#L1)
  - **API client**: [lib/api.ts](lib/api.ts#L1)
  - **Components**: [components/](components/)

- **Environment variables**: No `.env` checked in. Typical vars:
  - Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`
  - Backend: `DATABASE_URL`, `JWT_SECRET`, OAuth client IDs/secrets (Google/GitHub), `PORT`, `FRONTEND_URL`

- **Conventions & tech stack**: Next.js (app router), Tailwind CSS, Supabase (frontend), NestJS + Prisma (backend), PostgreSQL/Prisma migrations. Follow existing patterns in `components/` and `components/ui/` for UI primitives.

- **Agent guidance (concise)**:
  1. Run `npm install` (root) and `npm --prefix backend install` before edits.
  2. Use `npm run dev` (frontend) and `npm --prefix backend run start:dev` (backend) to test changes locally.
  3. Check for missing env vars early — many features depend on Supabase and OAuth keys.
  4. Preserve API routes and types; prefer updating shared types in `types/` and `lib/api.ts`.
  5. Link to existing docs or files rather than duplicating content.

- **Git notes**: Repo uses git. Create feature branches, use small commits, and run `npm run lint`/`npm run typecheck` before pushing.

- **If you need more**: I can add `.env.example` templates, CI notes, or split agent instructions per `frontend/` and `backend/` if desired.
