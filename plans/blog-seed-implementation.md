# Blog Seed Implementation Runbook

## Objective
Populate Blog Studio with 19 portfolio-quality React 19 blog posts using a deterministic Prisma seed process.

## Execution Strategy
1. Keep blog content in two TypeScript data files to reduce single-file complexity.
2. Use one seed script that creates or updates a single author and recreates that author's blog catalog.
3. Run and verify database count before frontend checks.

## Task Breakdown
1. Create `backend/prisma/data/blogs-part1.ts` with blogs 1-10.
2. Create `backend/prisma/data/blogs-part2.ts` with blogs 11-19.
3. Create `backend/prisma/seed.ts` and import both arrays.
4. Add `seed` script in `backend/package.json`.
5. Run `npm run seed` from backend.
6. Verify exactly 19 blogs exist for the seed author.

## Validation Commands
- `cd backend && npm run seed`
- `cd backend && node -e "const Database=require('better-sqlite3');const db=new Database('dev.db');console.log(db.prepare('select count(*) as c from Blog').get());"`

## Notes on Experimental APIs
Some covered topics are canary or framework-dependent:
- `captureOwnerStack()` and `<Activity />` are experimental/canary.
- `<ViewTransition />` is canary; stable alternatives vary by router/framework.
- Partial pre-rendering is primarily framework-level (e.g., Next.js App Router).

## Done Criteria
- Seed script executes successfully.
- 19 blogs inserted.
- Blog list endpoint returns seeded content.
