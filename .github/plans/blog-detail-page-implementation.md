## Plan: Blog Detail Page Navigation

Enable full blog viewing from the blog list by adding a single-blog backend endpoint, a React Query detail hook, a lazy-loaded `/blogs/:id` route, and clickable blog cards. Reuse the existing blog domain type and response mapping so list and detail views stay consistent, and handle loading, not-found, network-failure, and empty-content states explicitly.

**Steps**
1. Backend API: add `GET /blogs/:id` in `/home/sumeet/Desktop/folder/workspace/goals/React-19/backend/src/routes/blog.routes.ts` using `prisma.blog.findUnique` with author details included. Return `{ data: blog }` in the same shape as the list endpoint.
2. Backend 404 handling: when no blog exists, throw `new HttpError(404, "Blog not found")` so the current error middleware returns a structured `{ message }` response.
3. Shared mapping: extract or export the existing `BlogApiItem -> Blog` mapper from `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/shared/hooks/useBlogs.ts` so both list and detail queries normalize data identically.
4. Detail hook: add `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/shared/hooks/useBlog.ts` with a query key like `['blog', id]`, fetching `/blogs/:id`, and disabling the query if `id` is missing.
5. Detail page: create `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/features/blog/pages/BlogDetailPage.tsx` that reads route params, calls `useBlog`, and renders explicit states for loading, not found, network failure, success, and empty content.
6. Routing: update `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/routes/router.tsx` to lazy-load `BlogDetailPage` at module scope and add the `/blogs/:id` route. Match current auth behavior by wrapping it in `ProtectedRoute` if blog viewing stays authenticated.
7. Clickable cards: update `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/features/home/components/BlogItem.tsx` to use declarative navigation with `Link` to `/blogs/:id`; optionally use `viewTransition` to stay consistent with current routing.
8. Validation: run frontend build/tests and manually verify click-through, direct refresh on `/blogs/:id`, invalid id handling, network-failure state, empty-content fallback, and no console errors.

**Relevant files**
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/backend/src/routes/blog.routes.ts` — add single-blog endpoint and 404 logic.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/backend/src/middleware/errorHandler.ts` — reused, no expected changes.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/shared/hooks/useBlogs.ts` — export/refactor shared mapper.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/shared/hooks/useBlog.ts` — new detail query hook.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/features/blog/pages/BlogDetailPage.tsx` — new detail page.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/routes/router.tsx` — add lazy route.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/features/home/components/BlogItem.tsx` — make cards clickable.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/features/home/components/BlogList.tsx` — likely unchanged except for layout follow-through.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/shared/api/http.ts` — reused, no expected changes.
- `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend/src/shared/types/blog.ts` — reuse existing types unless a dedicated single-item alias improves clarity.

**Verification**
1. Run `npm run build` in `/home/sumeet/Desktop/folder/workspace/goals/React-19/frontend`.
2. Run existing frontend tests; add focused tests only if route/page coverage already exists in this repo.
3. Manually click a blog card from `/blogs` and confirm navigation to `/blogs/:id`.
4. Refresh directly on `/blogs/:id` and confirm the detail page loads correctly.
5. Open a fake blog id and confirm a not-found state appears.
6. Simulate backend unavailability and confirm a generic network-failure state appears.
7. Confirm empty content renders a fallback message instead of a blank content block.
8. Confirm there are no browser console errors.

**Decisions**
- Keep the backend path as `/blogs/:id`, because the current backend is mounted at `/blogs` and the frontend axios client already targets that shape.
- Prefer `Link` over imperative navigation; `startTransition` is not needed for simple route navigation.
- Reuse the existing `Blog` type to avoid unnecessary duplication.
- Keep the feature within the current client-rendered architecture; do not add SSR, markdown rendering, or API prefix refactors.

**Missing backend dependencies**
- None. Existing Express, Prisma, and `HttpError` utilities are sufficient.
