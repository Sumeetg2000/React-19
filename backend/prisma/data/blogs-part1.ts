export type SeedBlog = {
  title: string;
  content: string;
};

export const blogsPart1: SeedBlog[] = [
  {
    title: "captureOwnerStack() in React 19: Debugging Real Component Ownership",
    content: `Title: captureOwnerStack() in React 19: Debugging Real Component Ownership

Introduction:
When a production-only bug appears in a deeply composed component tree, normal stack traces often show rendering calls but not ownership intent. captureOwnerStack() helps advanced debugging by revealing who rendered whom, which is useful when reusable layout wrappers and provider composition hide the original source.

Concept explanation:
captureOwnerStack() is an advanced debugging utility exposed in experimental/canary React builds. It captures owner relationships in the component tree so you can inspect logical ownership rather than only runtime call stack. In a Blog Studio app, this helps when a post card gets incorrect props because an upstream owner passed stale configuration.

Code example:
~~~tsx
import { useEffect } from 'react';
// Experimental API: available in canary channels.
import { captureOwnerStack } from 'react';

type BlogCardProps = {
  blogId: string;
  highlight: boolean;
};

export function BlogCard({ blogId, highlight }: BlogCardProps) {
  useEffect(() => {
    if (highlight && import.meta.env.DEV) {
      const ownerStack = captureOwnerStack?.();
      if (ownerStack) {
        console.debug('Owner stack for highlighted blog card', {
          blogId,
          ownerStack,
        });
      }
    }
  }, [blogId, highlight]);

  return <article data-blog-id={blogId}>...</article>;
}
~~~

Explanation of example:
The card logs owner relationships only in development when a suspicious state appears (highlight true). This keeps noise low and avoids production overhead. Instead of instrumenting every parent, you capture context exactly when the bug state happens.

When to use:
Use it for hard-to-reproduce ownership bugs, especially in design systems, provider-heavy trees, and slot-based component composition.

When NOT to use:
Do not ship this as a user-facing telemetry feature. Avoid relying on it in stable-only environments, because availability depends on channel.

Impact on performance / developer experience:
Developer experience improves by reducing time-to-root-cause for ownership bugs. Runtime impact should be minimal if gated to development and conditional paths.`
  },
  {
    title: "Using <Activity /> to Observe Async UI States in React",
    content: `Title: Using <Activity /> to Observe Async UI States in React

Introduction:
Teams commonly guess whether a UI is pending, suspended, or resumed when troubleshooting UX hiccups. <Activity /> is designed to surface these transitions so developers can reason about async boundaries more precisely.

Concept explanation:
<Activity /> is an experimental React component intended for observing rendering activity across boundaries. It can help understand where async work starts and settles around Suspense and transitions. In Blog Studio, this is valuable when search, route transitions, and profile refreshes overlap.

Code example:
~~~tsx
import { Suspense, useState, useTransition } from 'react';
// Experimental API: canary channel only.
import { Activity } from 'react';

function BlogSearchPanel() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <section>
      <label htmlFor="blog-search">Search posts</label>
      <input
        id="blog-search"
        value={query}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(() => setQuery(next));
        }}
      />
      <Activity
        name="blog-search"
        onRender={(snapshot) => {
          if (import.meta.env.DEV) {
            console.info('Activity snapshot', snapshot);
          }
        }}
      />
      {isPending ? <p>Applying filters...</p> : null}
      <Suspense fallback={<p>Loading matching posts...</p>}>
        <FilteredBlogResults query={query} />
      </Suspense>
    </section>
  );
}

function FilteredBlogResults({ query }: { query: string }) {
  return <div>Results for {query}</div>;
}
~~~

Explanation of example:
The example tracks async behavior around search transitions and Suspense. The Activity callback gives visibility into render lifecycle events that are otherwise hard to time by intuition.

When to use:
Use in development diagnostics for apps with many async boundaries and performance-sensitive flows.

When NOT to use:
Avoid in production-critical paths and do not assume API stability in non-canary builds.

Impact on performance / developer experience:
Activity instrumentation improves observability and team confidence in concurrent behavior, but should be disabled outside diagnostics to keep overhead and noise low.`
  },
  {
    title: "useEffectEvent in React 19: Fresh Logic Without Re-Subscribing Effects",
    content: `Title: useEffectEvent in React 19: Fresh Logic Without Re-Subscribing Effects

Introduction:
A common bug in realtime features is stale closures in event listeners. Re-subscribing on every state change fixes correctness but increases churn and risks duplicate handlers.

Concept explanation:
useEffectEvent lets you define logic that always sees latest props/state while keeping the effect subscription stable. It separates reactive subscription setup from non-reactive callback logic.

Code example:
~~~tsx
import { useEffect, useEffectEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthStorageSync() {
  const navigate = useNavigate();

  const onStorageChange = useEffectEvent((event: StorageEvent) => {
    if (event.key !== 'blog-studio-auth-token') {
      return;
    }

    const hasToken = Boolean(event.newValue);
    if (!hasToken) {
      navigate('/login', { replace: true });
    }
  });

  useEffect(() => {
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [onStorageChange]);

  return null;
}
~~~

Explanation of example:
The effect subscribes once, while onStorageChange always reads current navigation context. You avoid stale closures and avoid re-attaching listeners every render.

When to use:
Use for subscriptions, timers, sockets, and DOM listeners where callback logic must stay fresh but subscription lifetime should stay stable.

When NOT to use:
Do not use it to bypass legitimate dependency modeling. If the effect itself depends on values for setup/teardown, keep dependencies explicit.

Impact on performance / developer experience:
Reduces accidental re-subscriptions and stale callback bugs. DX improves because effect code becomes easier to reason about: setup is stable, logic is fresh.`
  },
  {
    title: "Partial Pre-Rendering: Shipping Fast HTML Without Losing Dynamic React",
    content: `Title: Partial Pre-Rendering: Shipping Fast HTML Without Losing Dynamic React

Introduction:
Content-heavy pages need instant first paint, but fully dynamic rendering can delay response time. Partial pre-rendering balances static speed with dynamic freshness.

Concept explanation:
Partial pre-rendering (PPR) is generally a framework-level capability where a static shell is pre-rendered and dynamic sections stream or hydrate later. React 19 supports the underlying streaming and suspense primitives, but implementation is framework-specific (for example, Next.js App Router).

Code example:
~~~tsx
// Next.js-style conceptual example using React 19-compatible patterns.
import { Suspense } from 'react';

export default function BlogIndexPage() {
  return (
    <main>
      <header>
        <h1>Blog Studio</h1>
        <p>Read architecture and performance deep-dives.</p>
      </header>

      <Suspense fallback={<TrendingSkeleton />}>
        <TrendingPosts />
      </Suspense>

      <Suspense fallback={<RecentSkeleton />}>
        <RecentPosts />
      </Suspense>
    </main>
  );
}

function TrendingSkeleton() {
  return <div>Loading trending...</div>;
}

function RecentSkeleton() {
  return <div>Loading recent...</div>;
}

async function TrendingPosts() {
  const posts = await fetch('https://example.com/api/trending', { cache: 'no-store' }).then((r) => r.json());
  return <section>{posts.length} trending posts</section>;
}

async function RecentPosts() {
  const posts = await fetch('https://example.com/api/recent', { cache: 'no-store' }).then((r) => r.json());
  return <section>{posts.length} recent posts</section>;
}
~~~

Explanation of example:
The shell can be returned fast while each section resolves independently. Users see meaningful content earlier instead of waiting for every query.

When to use:
Use for editorial pages, dashboards, and mixed-static pages where some blocks are cacheable and others require fresh data.

When NOT to use:
Avoid forcing PPR in plain client-only Vite apps without SSR infrastructure.

Impact on performance / developer experience:
Improves TTFB and perceived load performance when supported by your framework. DX improves when teams design clean async boundaries with Suspense.`
  },
  {
    title: "Performance Tracking in React 19: Measuring UI Work, Not Guessing",
    content: `Title: Performance Tracking in React 19: Measuring UI Work, Not Guessing

Introduction:
Performance regressions often sneak in through harmless UI changes. Without measurement, teams debate opinions rather than data.

Concept explanation:
React performance tracking combines Profiler instrumentation, transition awareness, and browser metrics. In React 19-era apps, concurrent rendering means not every delay is equal, so you must measure commit duration and user-perceived responsiveness.

Code example:
~~~tsx
import { Profiler, useTransition, useState } from 'react';

type ProfileSample = {
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
};

const samples: ProfileSample[] = [];

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
): void {
  samples.push({ id, phase, actualDuration });
  if (actualDuration > 16) {
    console.warn('Slow render detected', { id, phase, actualDuration });
  }
}

export function SearchProfiler() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <Profiler id="BlogSearchResults" onRender={onRenderCallback}>
      <input
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          startTransition(() => setQuery(value));
        }}
        placeholder="Filter posts"
      />
      {isPending ? <p>Updating results...</p> : null}
      <Results query={query} />
    </Profiler>
  );
}

function Results({ query }: { query: string }) {
  return <div>Showing results for {query}</div>;
}
~~~

Explanation of example:
Profiler records update cost for result rendering. Transition keeps input responsive while updates are measured. Slow renders are flagged above one frame budget.

When to use:
Use around expensive lists, charts, rich editors, and pages where typing latency matters.

When NOT to use:
Do not leave heavy logging enabled in production if it floods console or analytics.

Impact on performance / developer experience:
Measurement-based tuning reduces blind optimization and makes regressions visible in PR review and QA environments.`
  },
  {
    title: "<ViewTransition /> and Router View Transitions: Practical Navigation Motion",
    content: `Title: <ViewTransition /> and Router View Transitions: Practical Navigation Motion

Introduction:
Navigation jumps can feel jarring in content apps. Smooth transitions reduce cognitive load when users move between list and detail contexts.

Concept explanation:
React canary introduces <ViewTransition /> while stable router ecosystems expose transition flags on links/navigation APIs. In a Vite + React Router stack, viewTransition support is often router-driven first, with component-level API still experimental.

Code example:
~~~tsx
import { Link } from 'react-router-dom';

type BlogRowProps = {
  id: string;
  title: string;
  excerpt: string;
};

export function BlogRow({ id, title, excerpt }: BlogRowProps) {
  return (
    <article className="rounded-xl border p-4">
      <h2>{title}</h2>
      <p>{excerpt}</p>
      <Link to={\`/blogs/\${id}\`} viewTransition>
        Read article
      </Link>
    </article>
  );
}
~~~

Explanation of example:
The link asks router navigation to use a view transition where supported. This improves continuity from list item to detail screen without custom animation plumbing.

When to use:
Use for list-to-detail, tab changes, and UI states where continuity helps orientation.

When NOT to use:
Avoid forced transitions on every minor state update or in unsupported environments without fallback.

Impact on performance / developer experience:
Good transitions improve perceived quality. Developer effort drops because navigation animation can be declarative instead of bespoke CSS choreography.

Note on support:
<ViewTransition /> itself is canary; prefer stable router-level options in production unless your stack explicitly supports the component.`
  },
  {
    title: "Fragment Refs: Managing Multi-Node UI as One Logical Surface",
    content: `Title: Fragment Refs: Managing Multi-Node UI as One Logical Surface

Introduction:
Complex cards often render multiple sibling nodes that conceptually belong together. Traditional refs force wrapper divs that can break semantics and styling.

Concept explanation:
Fragment refs (experimental) allow referencing grouped children without adding extra DOM wrappers. This can simplify focus management and measurement in highly composed interfaces.

Code example:
~~~tsx
import { Fragment, useRef, useEffect } from 'react';

export function InlineEditorRow() {
  const groupRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.scrollIntoView({ block: 'nearest' });
  }, []);

  return (
    <Fragment ref={groupRef}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" />
      <button type="submit">Save</button>
    </Fragment>
  );
}
~~~

Explanation of example:
The pattern avoids an unnecessary wrapper while still letting the editor group participate in imperative behavior like scroll/focus management.

When to use:
Use when wrappers create layout issues, semantic noise, or CSS side-effects.

When NOT to use:
Avoid in stable channels that do not support fragment refs. Use a semantic wrapper when compatibility is required.

Impact on performance / developer experience:
Potentially cleaner DOM and less wrapper churn. DX improves for component composition, but feature maturity should drive adoption timing.`
  },
  {
    title: "React Compiler in Practice: Fewer Memo Hooks, Same Predictable Performance",
    content: `Title: React Compiler in Practice: Fewer Memo Hooks, Same Predictable Performance

Introduction:
Large React codebases accumulate defensive useMemo and useCallback calls that add mental overhead. React Compiler aims to automate many of these optimizations safely.

Concept explanation:
React Compiler analyzes component code and inserts memoization where profitable. Instead of manually memoizing every derived value, teams focus on correctness and data flow clarity. This is not magic; pure component logic remains essential.

Code example:
~~~tsx
type Blog = {
  id: string;
  title: string;
  views: number;
};

type Props = {
  blogs: Blog[];
  query: string;
};

export function PopularBlogTable({ blogs, query }: Props) {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = blogs
    .filter((blog) => blog.title.toLowerCase().includes(normalizedQuery))
    .sort((left, right) => right.views - left.views)
    .slice(0, 20);

  return (
    <table>
      <tbody>
        {filtered.map((blog) => (
          <tr key={blog.id}>
            <td>{blog.title}</td>
            <td>{blog.views}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
~~~

Explanation of example:
No manual useMemo is needed for baseline clarity. With compiler enabled and pure logic preserved, many recalculation optimizations can be automated.

When to use:
Use in apps with compiler support and strict linting around purity.

When NOT to use:
Do not remove all manual memoization blindly in hot paths without measurement. Keep explicit optimization where profiling proves benefit.

Impact on performance / developer experience:
Compiler-first style can reduce boilerplate and stale dependency bugs while preserving speed. DX improves because components are easier to read and maintain.`
  },
  {
    title: "React Server Components (RSC): Moving Data Work Off the Client",
    content: `Title: React Server Components (RSC): Moving Data Work Off the Client

Introduction:
Client-only data fetching sends more JavaScript to users and repeats work across devices. React Server Components move suitable rendering and data access to the server.

Concept explanation:
RSC allows certain components to run server-side, fetch data directly, and stream serialized UI to the client. Client components are still used for interactivity. This split can reduce bundle size and improve initial load.

Code example:
~~~tsx
// Server component (conceptual, framework support required)
import { Suspense } from 'react';
import { BlogInteractiveFilters } from './BlogInteractiveFilters';

export default async function BlogPage() {
  const response = await fetch('https://example.com/api/blogs', { cache: 'no-store' });
  const blogs: Array<{ id: string; title: string }> = await response.json();

  return (
    <main>
      <h1>Blog Studio</h1>
      <Suspense fallback={<p>Preparing filters...</p>}>
        <BlogInteractiveFilters blogs={blogs} />
      </Suspense>
    </main>
  );
}
~~~

~~~tsx
'use client';

import { useState } from 'react';

type BlogInteractiveFiltersProps = {
  blogs: Array<{ id: string; title: string }>;
};

export function BlogInteractiveFilters({ blogs }: BlogInteractiveFiltersProps) {
  const [query, setQuery] = useState('');
  const visible = blogs.filter((blog) => blog.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <ul>{visible.map((blog) => <li key={blog.id}>{blog.title}</li>)}</ul>
    </section>
  );
}
~~~

Explanation of example:
Data fetching and initial list rendering happen server-side, while query interactions stay client-side. This gives lighter client bundles while preserving UX.

When to use:
Use for content-heavy pages with low interactivity in the initial render.

When NOT to use:
Avoid in pure client-only Vite setups unless you adopt an RSC-capable framework/runtime.

Impact on performance / developer experience:
Can significantly reduce client JavaScript and improve startup performance. DX improves once boundaries are well understood, but team discipline is required for server/client separation.`
  },
  {
    title: "Actions and New Async APIs in React 19 and 19.2",
    content: `Title: Actions and New Async APIs in React 19 and 19.2

Introduction:
Traditional form handlers scatter loading, errors, and race handling across state variables. React Actions unify submission, pending states, and update ordering.

Concept explanation:
React 19 introduces form Actions, useActionState, and useFormStatus patterns that reduce manual ceremony. Combined with transitions, actions provide predictable async UX with less boilerplate.

Code example:
~~~tsx
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

type CreateBlogState = {
  ok: boolean;
  message: string;
};

const initialState: CreateBlogState = {
  ok: false,
  message: '',
};

async function createBlogAction(
  _prev: CreateBlogState,
  formData: FormData,
): Promise<CreateBlogState> {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();

  if (!title || !content) {
    return { ok: false, message: 'Title and content are required.' };
  }

  const response = await fetch('/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    return { ok: false, message: 'Failed to publish post.' };
  }

  return { ok: true, message: 'Post published successfully.' };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Publishing...' : 'Publish'}</button>;
}

export function CreateBlogForm() {
  const [state, formAction] = useActionState(createBlogAction, initialState);

  return (
    <form action={formAction}>
      <input name="title" placeholder="Post title" />
      <textarea name="content" rows={8} placeholder="Write your article" />
      <SubmitButton />
      {state.message ? <p>{state.message}</p> : null}
    </form>
  );
}
~~~

Explanation of example:
The action owns validation and async submission lifecycle. Pending state is consumed declaratively through useFormStatus, avoiding local loading state sync bugs.

When to use:
Use for mutation-heavy forms like login, signup, profile edit, and content publishing.

When NOT to use:
Avoid forcing Actions where existing APIs require complex client-only transaction orchestration unrelated to form semantics.

Impact on performance / developer experience:
DX improves through fewer state variables and less race-condition code. Performance improves indirectly by reducing unnecessary re-renders from ad-hoc loading state management.`
  }
];
