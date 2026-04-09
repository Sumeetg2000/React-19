# Blog Seed Execution Plan

## Goal

Generate 19 high-quality technical blog posts on React 19 features and seed them into the SQLite database via a Prisma seed script.

## Decisions

- **Author**: Single author — `name: "React Expert"`, `email: "expert@reactblog.dev"`, `password: bcrypt hashed`
- **Content format**: Plain text with section headers embedded as `\n\n` separated blocks
- **Insertion method**: Prisma seed script (`tsx prisma/seed.ts` from backend/)
- **Idempotency**: Script uses `upsert` for author, deletes existing seed blogs before re-inserting

## Constraints

- Do NOT modify files in `/plans` during execution
- No markdown formatting in content (plain text only)
- No inline styles, no `any`
- All code examples: TypeScript + functional components

---

## Blog Topics

| # | Title | Category |
|---|-------|----------|
| 1 | captureOwnerStack() — Debugging React Component Trees | React 19 API |
| 2 | The Activity Component — Smarter Suspense State Detection | React 19 API |
| 3 | useEffectEvent — Stable Callbacks Without Stale Closures | React 19 Hook |
| 4 | Partial Pre-Rendering — Hybrid Static and Dynamic Rendering | React 19 Feature |
| 5 | Performance Tracking in React 19 — Profiler and Metrics APIs | React 19 Feature |
| 6 | ViewTransition in React — Animated Page Transitions | React 19 API |
| 7 | Fragment Refs — Targeting Multiple DOM Nodes as One | React 19 API |
| 8 | React Compiler — Automatic Optimization Without Memoization | React Compiler |
| 9 | React Server Components — Full-Stack Components in React 19 | RSC |
| 10 | Actions and New Async APIs in React 19 | React 19 Core |
| 11 | Enhanced Concurrent Rendering in React 19 | Concurrent |
| 12 | React Forget — How the Compiler Eliminates useMemo | Compiler |
| 13 | New Strict Mode Enhancements in React 19 | DX |
| 14 | Better Event Handling in React 19 | Events |
| 15 | Performance Monitoring with React DevTools | DevTools |
| 16 | Partial Hydration and Streaming Improvements | SSR |
| 17 | Bundling and Build Performance with Vite and React 19 | Build |
| 18 | Validation, Reverse KT and Lighthouse Verification | QA |
| 19 | Complete Guide to React Hooks | Foundations |

---

## File Structure to Create

```
backend/
  prisma/
    seed.ts              ← Prisma seed script (creates author + 19 blogs)
    data/
      blogs-part1.ts     ← Blog data: blogs 1–10
      blogs-part2.ts     ← Blog data: blogs 11–19
```

---

## Execution Steps

### Step 1 — Create Plan File (this file)
- **Status**: DONE
- **Validation**: File exists at `plans/blog-seed-execution.md`

---

### Step 2 — Create `backend/prisma/data/blogs-part1.ts`
- Blogs 1–10 (React 19 APIs + hooks)
- Each blog: `{ title: string, content: string }`
- Content: 1500–2500 words, plain text, sections separated by `\n\n`
- Section order: Introduction → Concept → Code Example → Explanation → When to Use → When NOT to Use → Performance Impact
- **Validation**: File compiles without TypeScript errors

---

### Step 3 — Create `backend/prisma/data/blogs-part2.ts`
- Blogs 11–19 (Concurrent, Compiler, DX, Build, Foundations)
- Same structure as part 1
- **Validation**: File compiles without TypeScript errors

---

### Step 4 — Create `backend/prisma/seed.ts`
- Import from `./data/blogs-part1` and `./data/blogs-part2`
- Import `PrismaClient`, `bcryptjs`, `@prisma/adapter-better-sqlite3`
- Import `dotenv/config` to load `.env` before creating Prisma client
- Logic:
  1. Hash password for seed author
  2. `upsert` seed author by email
  3. Delete all blogs authored by seed author (clean re-seed)
  4. Loop through all 19 blogs, `prisma.blog.create()` for each
  5. Log `Seeding blog X/19: <title>`
  6. Final log: `Seeded 19 blogs successfully`
  7. `prisma.$disconnect()` in finally block
- **Validation**: TypeScript compiles with `tsc --noEmit`

---

### Step 5 — Add seed script to `backend/package.json`
- Add: `"seed": "tsx prisma/seed.ts"`
- **Validation**: `npm run seed` recognized as valid script

---

### Step 6 — Run seed and verify database
- Run: `cd backend && npm run seed`
- Expected output: 19 "Seeding blog X/19" lines + success message
- Verify: `npx prisma studio` or direct SQLite query shows 19 Blog rows
- **Validation**: Exit code 0, no errors

---

### Step 7 — Test frontend blog display
- Start frontend: `cd frontend && npm run dev`
- Navigate to `http://localhost:5173`
- Verify: 19 blog cards visible on home page
- Verify: Each card shows title, excerpt (first ~140 chars), author name "React Expert", date
- Verify: Search for "React Compiler" returns 1 blog
- Verify: No console errors
- **Validation**: All 19 blogs displayed correctly

---

## Rollback Plan

If seed fails:
1. Check `.env` has `DATABASE_URL="file:./dev.db"`
2. Run `npx prisma migrate deploy` to ensure schema is up to date
3. Delete `dev.db` and re-run migrations + seed

If frontend shows 0 blogs:
1. Hard refresh browser (Ctrl+Shift+R)
2. Check backend is running on port 3000
3. Check browser console for network errors

---

## Sign-off Checklist

- [ ] Step 1: Plan file created
- [ ] Step 2: blogs-part1.ts created and compiles
- [ ] Step 3: blogs-part2.ts created and compiles
- [ ] Step 4: seed.ts created and compiles  
- [ ] Step 5: package.json has seed script
- [ ] Step 6: Seed runs cleanly, 19 blogs in DB
- [ ] Step 7: Frontend displays all 19 blogs, search works
