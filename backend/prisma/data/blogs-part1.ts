export type SeedBlog = {
  title: string;
  content: string;
};

export const blogsPart1: SeedBlog[] = [
  {
    title: 'captureOwnerStack() in React 19: Debugging Real Component Ownership',
    content: `Title: captureOwnerStack() in React 19: Debugging Real Component Ownership

Overview:
React 19 ships captureOwnerStack() as an advanced debugging utility that reveals the logical ownership chain in a component tree. This article explains what it returns, how it differs from a JavaScript call stack, and how to use it to trace prop-propagation bugs in deeply composed UIs.

Prerequisites:
Familiarity with React component trees, props, and useEffect. Understanding of how JSX elements have an owner—the component whose render function created them. Access to a React 19 canary or experimental build, since the API is not yet in a stable release.

Problem Statement:
When a bug surfaces in a deeply nested component, the JavaScript call stack shows execution order, not who decided to render the component with specific props. In large apps with design systems, slot-based composition, and many context providers, the true owner of a broken render can be several layers removed from where the symptom appears.

Concept Explanation:
Every React element has an owner—the component responsible for rendering it. captureOwnerStack() traverses this ownership chain and returns it as a formatted string describing React logical composition, not JavaScript call frames. This makes it invaluable for debugging prop-delegation bugs where an upstream component passed stale or incorrect data through multiple intermediaries before reaching the leaf component that misbehaves.

Core API / Syntax:
captureOwnerStack() is a named export from the react package available in experimental and canary builds. It returns a string describing the current owner chain or null when called outside a render or effect. It reads no arguments and has no configuration. Always guard calls with import.meta.env.DEV and optional chaining since the function may not exist in stable releases.

Code Example:
~~~tsx
import { useEffect } from 'react';
import { captureOwnerStack } from 'react';

type BlogCardProps = {
  blogId: string;
  highlighted: boolean;
};

export function BlogCard({ blogId, highlighted }: BlogCardProps) {
  useEffect(() => {
    if (highlighted && import.meta.env.DEV) {
      const ownerStack = captureOwnerStack?.();
      if (ownerStack) {
        console.debug('[BlogCard] Owner stack for highlighted card:', {
          blogId,
          ownerStack,
        });
      }
    }
  }, [blogId, highlighted]);

  return (
    <article data-blog-id={blogId} data-highlighted={String(highlighted)}>
      <h2>Blog {blogId}</h2>
    </article>
  );
}
~~~

Explanation of Code:
The useEffect fires when the highlighted prop changes from false to true. The import.meta.env.DEV guard ensures no capture logic runs in production. Optional chaining on captureOwnerStack?.() prevents a runtime crash in stable React builds where the API does not exist. The logged owner chain identifies which component last rendered BlogCard with highlighted={true}, pointing directly to the source of the unintended prop value.

Real-World Use Case:
In a Blog Studio app, a BlogCard should only be highlighted for the active post. When users report two cards highlighted simultaneously, captureOwnerStack() immediately reveals whether the duplicate highlight came from SearchResults, RecentPosts, or a shared PostGrid layout — cutting hours of investigation down to a single console log.

Performance Impact:
captureOwnerStack() has negligible runtime overhead in development. It traverses the fiber owner chain synchronously but the traversal is shallow for typical trees. It introduces zero overhead in production when properly guarded behind the DEV flag and does not affect React's scheduler, batching, or commit phases.

When to Use:
Use captureOwnerStack() when debugging hard-to-reproduce ownership-driven prop bugs in deeply composed trees, design system components with slot-based rendering, or provider-heavy architectures where props flow through many intermediaries before reaching the broken component.

When NOT to Use:
Do not ship captureOwnerStack() calls in production code. Do not use it as a general telemetry or logging feature. Avoid relying on it in stable React builds — always use optional chaining. It is not a replacement for React DevTools when you need to inspect the full component tree interactively.

Pros:
Reveals the logical ownership chain rather than the JavaScript call stack. Directly identifies which component is responsible for incorrect props. Available at any point during rendering or effects in development. Zero production cost when properly guarded.

Cons:
Only available in React canary and experimental builds, not in stable releases. Returns an opaque string rather than a structured object, requiring manual reading. Not useful for debugging timing bugs, async races, or state mutation issues. Requires optional chaining in every callsite to avoid crashes in stable builds.

Common Mistakes:
Calling captureOwnerStack() in production without a DEV guard. Forgetting optional chaining, which causes a runtime ReferenceError in stable React. Logging on every render instead of conditionally when the specific problematic state is observed. Expecting the owner stack to explain why a prop changed over time — it only shows the current ownership snapshot.

Best Practices:
Always wrap in import.meta.env.DEV or process.env.NODE_ENV checks. Use optional chaining: captureOwnerStack?.(). Log to console.debug rather than console.log so output can be filtered in DevTools. Trigger the capture only when the bug state is actively observed to reduce noise.

Conclusion:
captureOwnerStack() fills a gap that standard DevTools and JavaScript stack traces leave open: identifying who logically owns a component in a composed tree. For teams maintaining large component libraries or complex provider graphs, this API can dramatically reduce debugging time by precisely answering the question of which component rendered this with these props.`,
  },
  {
    title: 'Using <Activity /> to Observe Async UI States in React',
    content: `Title: Using <Activity /> to Observe Async UI States in React

Overview:
React 19 introduces Activity (formerly Offscreen) as a first-class primitive for keeping component subtrees alive in memory while hiding them from the visible UI. This article explains its lifecycle semantics and how to use it for instant tab switching, preloading off-screen content, and preserving component state without destroying it on hide.

Prerequisites:
Understanding of React component mounting, unmounting, and effect cleanup. Familiarity with Suspense and concurrent features introduced in React 18. Basic knowledge of how useEffect fires and cleans up relative to component visibility. Access to a React 19 experimental or canary build.

Problem Statement:
React's default behavior tears down state and effects when a component unmounts. For UI patterns like tab panels, carousels, or route preloading, every revisit pays the full mount cost: re-fetching data, re-running setup animations, and losing scroll position. CSS-based workarounds using display:none keep components in the DOM but block garbage collection and incur layout overhead for invisible content.

Concept Explanation:
Activity introduces a visibility mode that React understands at the fiber level. When mode is set to hidden, React pauses effects, suspends Suspense boundaries, and deprioritizes the hidden tree's work while preserving its state entirely in memory. When mode returns to visible, React resumes effects and commits the preserved state instantly, skipping the mount phase. This gives React full awareness of hidden UI rather than relying on CSS tricks.

Core API / Syntax:
Activity wraps a subtree and accepts a single mode prop with values visible or hidden. Mode visible is the default and renders normally. Mode hidden preserves state but hides output from the DOM and pauses layout effects. The component is available as a named export from the react package on canary builds.

Code Example:
~~~tsx
import { Activity } from 'react';
import { useState } from 'react';
import { BlogList } from '@/features/home/components/BlogList';
import { BlogDrafts } from '@/features/drafts/components/BlogDrafts';

type Tab = 'published' | 'drafts';

export function BlogTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('published');

  return (
    <div>
      <nav className="mb-6 flex gap-2">
        {(['published', 'drafts'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab
              ? 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium capitalize text-white'
              : 'rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium capitalize text-gray-600 hover:bg-gray-200'
            }
          >
            {tab}
          </button>
        ))}
      </nav>

      <Activity mode={activeTab === 'published' ? 'visible' : 'hidden'}>
        <BlogList />
      </Activity>

      <Activity mode={activeTab === 'drafts' ? 'visible' : 'hidden'}>
        <BlogDrafts />
      </Activity>
    </div>
  );
}
~~~

Explanation of Code:
Both BlogList and BlogDrafts are always mounted. Each toggles between visible and hidden based on the active tab. When a tab becomes hidden, React pauses its effects and removes it from the painted UI while keeping state in memory. When it becomes visible again, React restores the preserved state without re-mounting — making the tab switch instant and preserving scroll position. Neither subtree is ever destroyed and re-created.

Real-World Use Case:
In a Blog Studio app with Published, Drafts, and Scheduled tabs, users frequently switch views mid-scroll. With Activity, switching from Drafts back to Published instantly restores the scroll position and React Query cache state without a re-fetch. The Drafts tab preloads its data in the background while hidden, so it appears immediately when first activated.

Performance Impact:
Hidden trees are deprioritized in React's scheduler, meaning they do not block visible work. Layout effects in hidden trees are paused, reducing layout recalculation overhead. Memory usage increases because hidden trees remain allocated — this is the intentional tradeoff for instant reactivation. For very large subtrees, measure peak memory impact before committing to this pattern across many routes.

When to Use:
Use Activity for tab panels where users frequently switch and expect preserved scroll or form state. Use it for preloading routes that are likely to be visited next based on user behavior. Use it for carousels and slide-based UI where each slide should retain its internal state between activations.

When NOT to Use:
Do not use Activity if you want every activation to show freshly fetched data. Do not use it for UI sections users visit rarely — the persistent memory cost is not justified. Avoid using it in very large trees without measuring peak memory in browser DevTools first. Do not use it as a replacement for proper route-level code splitting.

Pros:
Eliminates remount costs for frequently toggled UI sections. Preserves scroll position, form values, and query cache state across visibility changes. Deprioritizes hidden work automatically without developer intervention. Enables true background preloading within the same React tree.

Cons:
Only available in canary builds — not production-stable. Increases memory footprint since hidden trees remain allocated. Requires careful effect lifecycle management since effects pause rather than clean up on hide. API surface may change before stable release.

Common Mistakes:
Wrapping too many large trees in Activity without profiling memory usage. Expecting effects to clean up when a tree becomes hidden — they pause, not unmount. Using Activity for data that should always be fresh on every visit. Forgetting that hidden trees still consume React fiber memory and component state allocations.

Best Practices:
Keep hidden trees lean by separating data-fetching components from presentation components. Pair with React Query so cache management is independent of Activity visibility. Measure memory before and after adding Activity using browser DevTools Memory panel. Derive the mode prop from state rather than computing it inline in JSX.

Conclusion:
Activity brings a first-class solution to the persistent challenge of preserving UI state across visibility toggles. For applications where user experience depends on instant tab switching and preserved context, it is a significant improvement over CSS-only workarounds and replaces brittle manual state-lifting patterns with a single declarative mode prop.`,
  },
  {
    title: 'useEffectEvent in React 19: Fresh Logic Without Re-Subscribing Effects',
    content: `Title: useEffectEvent in React 19: Fresh Logic Without Re-Subscribing Effects

Overview:
useEffectEvent is a React 19 hook that lets you read the most recent props and state values inside an effect callback without listing them as dependencies. This article explains the stale closure problem it solves, how it separates reactive from non-reactive logic inside effects, and when to use it versus alternative patterns.

Prerequisites:
Strong understanding of useEffect and its dependency array behavior. Familiarity with stale closure bugs and how the exhaustive-deps ESLint rule enforces dependency listing. Some exposure to React's concurrent rendering model where effects can observe slightly stale values.

Problem Statement:
useEffect re-runs every time a dependency changes. When a callback inside an effect reads a value that changes often — such as a current user preference or a logging function — adding that value to the dependency array causes the effect to re-subscribe far more often than intended. This disconnects and reconnects WebSocket connections, re-attaches event listeners, or duplicates analytics calls without any benefit.

Concept Explanation:
useEffectEvent creates a stable function reference whose body always reads the latest values from its closure at call time, not at the time the effect first ran. This function is intentionally excluded from the effect dependency array. React calls it an effect event to signal that it represents a stable handler with always-fresh reads. This cleanly separates the reactive parts of an effect — what triggers re-subscription — from the non-reactive parts — what logic runs when the subscription fires.

Core API / Syntax:
useEffectEvent(callback) wraps a function that reads current props or state. The returned function is stable across renders. It must only be called from inside an effect — never from event handlers, render logic, or other hooks. It is available as a named export from the react package in React 19 stable builds.

Code Example:
~~~tsx
import { useEffect, useEffectEvent } from 'react';
import { useBlogs } from '@/shared/hooks/useBlogs';

type AnalyticsProps = {
  userId: string;
  preferences: { theme: string; lang: string };
};

export function useAnalyticsBlogView({ userId, preferences }: AnalyticsProps) {
  const { data: blogs } = useBlogs();

  const logView = useEffectEvent((blogCount: number) => {
    console.log('[Analytics] Blog list viewed', {
      userId,
      preferences,
      blogCount,
    });
  });

  useEffect(() => {
    if (blogs) {
      logView(blogs.length);
    }
  }, [blogs, logView]);
}
~~~

Explanation of Code:
The useEffect re-runs only when the blogs query result changes. logView is wrapped in useEffectEvent so it always reads the latest userId and preferences at the time it is called — without those values appearing in the dependency array. When the user switches themes or when userId updates between navigation events, the effect does not re-subscribe. The analytics call fires exactly once per blog list change, always with fresh identity data.

Real-World Use Case:
In a Blog Studio app, a view-tracking hook subscribes to a blog feed. The logging logic needs the current user's ID and language preference for telemetry, but these values change independently of the feed subscription. Without useEffectEvent, every preference change would cause the feed to re-subscribe unnecessarily. With it, the effect subscribes exactly once per blog list update while always logging the latest user context.

Performance Impact:
useEffectEvent reduces unnecessary effect teardown-and-reinitiation cycles. For effects that establish subscriptions, timers, or network connections, this directly reduces the number of resource allocations per session. The hook adds minimal overhead — a single stable wrapper allocation per component mount. The runtime savings scale with how frequently the non-reactive values change.

When to Use:
Use useEffectEvent when an effect's callback reads values that should be fresh at call time but should not control when the effect re-subscribes. Common cases include: logging functions, analytics calls, toast notification triggers, and feature flag reads inside subscription effects.

When NOT to Use:
Do not use useEffectEvent to silence exhaustive-deps warnings without understanding why. Do not call the returned function outside an effect — it is explicitly designed for in-effect context only. Do not use it when the value genuinely should re-trigger the subscription when it changes.

Pros:
Eliminates stale closure bugs in effects without bloating the dependency array. Reduces unnecessary effect re-subscriptions for stable connections like WebSockets. Officially supported pattern aligned with React's long-term direction. Works cleanly with the exhaustive-deps lint rule.

Cons:
Only callable from within effects, which limits reuse patterns compared to regular callbacks. Concept requires understanding the reactive versus non-reactive distinction to avoid misuse. Overuse can obscure which values genuinely drive an effect's lifecycle. New developers may misuse it as a general escape hatch for dependency array warnings.

Common Mistakes:
Calling the effect event function from render logic or event handlers outside effects. Using it to intentionally suppress dependencies that should actually control the re-subscription. Wrapping too much logic inside the event, blurring the boundary between reactive and non-reactive behavior. Forgetting that the returned function is only safe to call in effect context.

Best Practices:
Keep the effect event function small and focused — only the logic that genuinely needs always-fresh values. Name the function to reflect its intent: logAction, notifyUser, sendAnalytics. Leave all reactive triggers as explicit dependencies on the effect. Use the exhaustive-deps ESLint rule to guide when effect events are the right tool.

Conclusion:
useEffectEvent is a precision tool for the specific problem of reading current values in an effect without re-triggering the effect subscription. When used correctly it makes effects cleaner, reduces resource waste, and eliminates a class of stale closure bugs that have been a persistent challenge in React hook development since effects were introduced.`,
  },
  {
    title: 'Partial Pre-Rendering: Shipping Fast HTML Without Losing Dynamic React',
    content: `Title: Partial Pre-Rendering: Shipping Fast HTML Without Losing Dynamic React

Overview:
Partial Pre-Rendering (PPR) is a React 19 rendering strategy that generates a static HTML shell at build time and streams dynamic Suspense slots into it at request time. This article explains the PPR model, how it combines static generation and server rendering at the route level, and how to use Suspense boundaries to define the static-dynamic split.

Prerequisites:
Understanding of server-side rendering, static site generation, and Suspense. Familiarity with streaming HTML responses via renderToPipeableStream. Basic knowledge of React Server Components and a PPR-capable framework such as Next.js 15 or later.

Problem Statement:
Traditional static generation produces fast first bytes but stale dynamic content. Server-side rendering delivers current data but pays full server latency on every request. Apps that need both fast delivery and fresh data have historically had to choose one or use complex hybrid techniques like Incremental Static Regeneration, which adds implementation overhead and cache invalidation complexity.

Concept Explanation:
PPR splits a single route into a static outer shell — pre-rendered at build time and served instantly from a CDN — and dynamic inner slots, each wrapped in a Suspense boundary. The static shell is sent as the initial HTML response. Dynamic slots are streamed into the response as their server data resolves. From the browser, the page paints immediately from the static CDN-cached shell, then content streams in — like skeleton UI but driven by actual server streaming rather than client-side re-fetching.

Core API / Syntax:
PPR is activated in Next.js 15 and later via the experimental_ppr route segment config export. Dynamic slots are created by wrapping any component that fetches data in a Suspense boundary with a meaningful fallback. Static content outside Suspense boundaries is auto-extracted into the pre-rendered shell. No other code changes are required to indicate what is static versus dynamic.

Code Example:
~~~tsx
import { Suspense } from 'react';
import { BlogListSkeleton } from '@/features/home/components/BlogListSkeleton';
import { BlogListServer } from '@/features/home/components/BlogListServer';

export const experimental_ppr = true;

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Blog Studio</h1>
        <p className="mt-1 text-sm text-gray-500">
          All published articles from our engineering team.
        </p>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogListServer />
        </Suspense>
      </div>
    </main>
  );
}
~~~

Explanation of Code:
The header element is static content — rendered to HTML at build time and served from edge cache with zero server latency. BlogListServer is a React Server Component that fetches live blog data and is wrapped in Suspense so the framework identifies it as a dynamic slot. The static HTML shell includes the header and the skeleton fallback. The live blog list streams in once the server fetch resolves, replacing the skeleton seamlessly. The experimental_ppr export opts the route into PPR.

Real-World Use Case:
A Blog Studio home page has a static site header, navigation, and marketing copy that never changes, plus a live blog feed that updates daily. With PPR, the static elements are served from a CDN at sub-10ms TTFB. The blog list streams from the nearest edge server within 100 to 200ms. Users see a fully painted page outline immediately, then watch article cards appear as they stream in — much faster than waiting for a complete server-rendered response.

Performance Impact:
Time to First Byte drops to CDN latency for the static shell. First Contentful Paint improves because the skeleton and layout are already painted from the CDN response. Server compute is reduced because only dynamic slots hit the origin server. The Largest Contentful Paint depends on when the dynamic slot resolves, but it is isolated from the static shell's delivery time.

When to Use:
Use PPR for routes that have a stable layout combined with dynamic data: authenticated dashboards, product listing pages with live inventory, and article pages where navigation is static but content is personalized. It is a natural fit for any page where the chrome — nav, header, footer — is stable but the main content changes frequently.

When NOT to Use:
Do not use PPR for fully static pages where plain static generation is simpler and sufficient. Do not use it for routes that are entirely dynamic with no meaningful static shell — server-side rendering is clearer. Avoid using PPR if your framework does not support it natively, as manual implementation requires significant infrastructure.

Pros:
Near-instant TTFB from the CDN-cached static shell. Fresh dynamic data without ISR cache invalidation complexity. Single mental model for static and dynamic content in one route. Fully compatible with existing Suspense patterns — no migration needed.

Cons:
Requires a framework that supports PPR at the infrastructure level, currently Next.js 15 and later. The static-dynamic boundary must be explicitly designed and maintained. Dynamic slots still pay a server round-trip. Debugging streaming responses is more complex than inspecting a single HTML document.

Common Mistakes:
Not wrapping dynamic components in Suspense, which forces the entire page to wait rather than streaming. Putting authentication or session logic in the static shell, which should contain only truly invariant content. Forgetting to provide meaningful skeleton fallbacks for Suspense boundaries. Assuming PPR eliminates all server latency — it eliminates it only for the static shell, not the dynamic slots.

Best Practices:
Design pages with a clear static outer shell and discrete dynamic slots from the beginning. Always provide meaningful skeleton fallbacks for every Suspense boundary. Keep the static shell lightweight so CDN cache hit rates stay high. Measure TTFB and Largest Contentful Paint separately to understand PPR's actual impact on each metric.

Conclusion:
Partial Pre-Rendering represents a meaningful evolution in how React apps balance performance and data freshness. By formalizing the static-dynamic split at the route level and leveraging Suspense as the natural dynamic boundary, PPR makes it possible to achieve CDN-speed delivery for page shells without sacrificing live data in the content slots.`,
  },
  {
    title: 'Performance Tracking in React 19: Measuring UI Work, Not Guessing',
    content: `Title: Performance Tracking in React 19: Measuring UI Work, Not Guessing

Overview:
React 19 enhances the Profiler API and introduces new instrumentation patterns for measuring rendering work in both development and production. This article explains how to set up React built-in profiling, integrate it with the Performance API, and build repeatable measurement workflows that surface regressions before they reach users.

Prerequisites:
Familiarity with React's Profiler component and its onRender callback. Basic understanding of the browser Performance API and performance.mark and performance.measure. Some exposure to React DevTools Profiler for development-time analysis and an understanding of frame budgets for smooth 60fps rendering.

Problem Statement:
Most performance investigations start after users complain. By then, regressions are already in production and the data needed to reproduce them — specific component render times, interaction latencies, and re-render frequencies — is gone. React apps lack built-in production performance visibility without manual instrumentation, leading to either uninstrumented apps or heavyweight third-party RUM overhead.

Concept Explanation:
React's Profiler component wraps a subtree and calls onRender after every commit with timing breakdowns: actual render duration, base render duration, phase — mount or update — and the timestamp of the commit. In React 19, this data can be combined with browser User Timing marks to create labelled entries visible in the Performance Timeline and Lighthouse traces, connecting React render events to real user interaction timelines.

Core API / Syntax:
Profiler from react wraps the subtree to measure and accepts an id string and an onRender callback. The callback receives: id, phase (mount, update, or nested-update), actualDuration in milliseconds, baseDuration in milliseconds, startTime, and commitTime. Use performance.mark and performance.measure to create entries visible in the browser DevTools Timeline.

Code Example:
~~~tsx
import { Profiler, type ProfilerOnRenderCallback } from 'react';
import { BlogList } from '@/features/home/components/BlogList';

const FRAME_BUDGET_MS = 16;

const handleRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  _baseDuration,
  startTime,
  commitTime,
) => {
  performance.mark(\`react-\${id}-\${phase}-start\`, { startTime });
  performance.mark(\`react-\${id}-\${phase}-end\`, { startTime: commitTime });
  performance.measure(\`react-\${id}-\${phase}\`, {
    start: \`react-\${id}-\${phase}-start\`,
    end: \`react-\${id}-\${phase}-end\`,
  });

  if (actualDuration > FRAME_BUDGET_MS) {
    console.warn(
      \`[Perf] Slow render in \${id} (\${phase}): \${actualDuration.toFixed(1)}ms\`,
    );
  }
};

export function BlogListProfiled() {
  return (
    <Profiler id="BlogList" onRender={handleRender}>
      <BlogList />
    </Profiler>
  );
}
~~~

Explanation of Code:
handleRender creates User Timing marks at the commit start and end, making them visible in the Chrome Performance Timeline as labelled segments. The performance.measure call groups them into a named measure for easy identification. When actualDuration exceeds 16ms — the 60fps frame budget — a warning logs immediately in development. The component is a wrapper that adds instrumentation without modifying BlogList itself, keeping the measured component pure.

Real-World Use Case:
In a Blog Studio app, BlogList re-renders on every search query change. Wrapping it in Profiler during a performance investigation reveals that filtering 500 blog entries triggers 80ms renders — well above the 16ms frame budget. The User Timing entries in the Performance Timeline correlate exactly with dropped frames in the FPS chart, confirming the filter computation as the root cause and justifying a useDeferredValue refactor.

Performance Impact:
In development, Profiler adds measurement overhead that amplifies actual render costs — do not use development timing as production benchmarks. In production, React suppresses the Profiler in the default react-dom bundle — use the react-dom/profiling build to enable it. User Timing marks add less than 0.1ms each in typical usage, making them low enough overhead for production RUM use.

When to Use:
Use Profiler when investigating specific slow renders identified in field RUM data or DevTools recordings. Use it in automated performance tests to enforce render time budgets. Use it to establish a measured baseline before and after refactoring suspected rendering bottlenecks.

When NOT to Use:
Do not leave Profiler wrapping the entire app in production with console logging active — it creates noise and minor overhead. Do not treat development Profiler data as production performance benchmarks. Do not profile in development React builds for production comparisons — use the react-dom/profiling bundle.

Pros:
Zero-dependency, first-party profiling with React-level render granularity. Creates User Timing entries visible in standard DevTools Performance Timeline. Can be enabled or disabled per-subtree without app-wide configuration. Provides both mount and update costs separately via the phase parameter.

Cons:
Disabled in default production builds — requires the heavier react-dom/profiling bundle for production use. Does not capture async work outside React's render pipeline such as network fetches. Manual integration is needed to forward data to monitoring systems. Development render times are higher than production, making direct comparison unreliable.

Common Mistakes:
Using development Profiler output as the benchmark for production performance decisions. Wrapping the entire app in a single Profiler instance instead of instrumenting specific suspect subtrees. Interpreting baseDuration as actual duration — baseDuration assumes no memoization while actualDuration reflects the real cost. Logging every render instead of only when thresholds are exceeded.

Best Practices:
Log only when actualDuration exceeds a meaningful threshold such as 16ms. Use performance.measure to make render spans visible in the Timeline for easy correlation with user interactions. Name Profiler instances after the component they wrap for clear trace labeling. Remove or conditionally disable Profiler in the default production bundle unless using the profiling build.

Conclusion:
React's Profiler API provides the precise, React-aware timing data needed to make informed optimization decisions. By combining it with User Timing marks and threshold-based warnings, teams can build systematic performance visibility rather than relying on guesswork, post-release complaints, or single-point DevTools sessions.`,
  },
  {
    title: '<ViewTransition /> and Router View Transitions: Practical Navigation Motion',
    content: `Title: <ViewTransition /> and Router View Transitions: Practical Navigation Motion

Overview:
React 19 introduces the ViewTransition component as a first-class integration with the browser View Transitions API. This article explains how ViewTransition works with React Router navigation, how to configure transition animations via CSS, and how to build smooth page-to-page motion without a JavaScript animation library.

Prerequisites:
Familiarity with React Router v6 or later and the Link component. Basic CSS animation knowledge including keyframes and animation properties. Understanding of startTransition and React's concurrent rendering model. A modern browser with View Transitions API support — Chrome 111 or later, Safari 18 or later.

Problem Statement:
Navigation between pages in single-page applications has historically required JavaScript animation libraries to produce smooth transitions. These libraries add bundle weight, require careful integration with the routing lifecycle, and often fight with React's rendering pipeline for control over DOM mutations. The result is complex, brittle animation code that is frequently the first thing removed under deadline pressure.

Concept Explanation:
The View Transitions API lets the browser capture a screenshot of the current DOM state, perform a DOM update, and then animate between the two captured states using CSS. React 19's ViewTransition wraps the DOM mutation inside document.startViewTransition() automatically when navigation occurs inside a startTransition call. This means every Link with the viewTransition prop triggers a browser-native GPU-composited transition controlled entirely by CSS — no JavaScript animation loop required.

Core API / Syntax:
ViewTransition from react wraps a subtree. When a startTransition navigation happens inside a ViewTransition boundary, React coordinates the DOM update with the browser's transition API. Define animations using the ::view-transition-old and ::view-transition-new CSS pseudo-elements. Assign viewTransitionName on specific elements for shared-element transitions. Link in React Router gains the viewTransition prop to trigger the coordination automatically.

Code Example:
~~~tsx
import { ViewTransition } from 'react';
import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <ViewTransition>
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-4">
            <Link
              to="/blogs"
              viewTransition
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              All Blogs
            </Link>
            <Link
              to="/blogs/create"
              viewTransition
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              New Post
            </Link>
          </div>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </ViewTransition>
  );
}
~~~

Explanation of Code:
ViewTransition wraps the entire layout so any child navigation that uses startTransition can trigger a view transition. Both Link elements carry the viewTransition prop, which tells React Router to wrap the navigation state update in startTransition internally. The browser captures a screenshot before the update, React commits the new route, and CSS view-transition pseudo-elements animate the visual diff. No animation library is imported and no JavaScript animation frame loop runs during the transition.

Real-World Use Case:
In a Blog Studio app, navigating from the blog list to a blog detail page should feel like opening an article — a smooth fade or slide, not an abrupt DOM swap. Adding viewTransition to the Link in BlogItem and adding CSS fade rules to the global stylesheet produces a polished transition in under ten lines of code, replacing a Framer Motion AnimatePresence setup that previously required over 80 lines of configuration and a non-trivial bundle addition.

Performance Impact:
View transitions are browser-native and GPU-composited, meaning no JavaScript animation loop runs during the transition. The crossfade does not trigger layout recalculation. The browser holds captured screenshots in memory only for the transition duration — typically 250ms. React's concurrent scheduler still controls when the new content commits, maintaining interaction responsiveness throughout the transition.

When to Use:
Use ViewTransition for page-to-page navigation animations where continuity and visual polish matter. Use viewTransitionName on specific preserved elements like article thumbnails for shared-element transitions between list and detail views. Use it anywhere the browser native GPU animation is preferable to JavaScript-driven motion.

When NOT to Use:
Do not use ViewTransition for animations triggered by internal component state changes — use CSS transitions or keyframe animations directly. Do not use it without a graceful degradation strategy in browsers that do not support the View Transitions API yet. Avoid using it for complex sequence animations that require fine-grained JavaScript choreography.

Pros:
No JavaScript animation runtime — transitions are browser-native and GPU-composited. Integrates directly with React Router via the viewTransition prop on Link. CSS-controlled animations are straightforward to adjust or disable entirely with a media query. Works with React's concurrent model without coordination complexity.

Cons:
Browser support is incomplete — not yet supported in Firefox as of mid-2025. Requires understanding of view-transition CSS pseudo-elements. Complex cross-element animations require careful viewTransitionName coordination. Debugging visual artifacts requires browser DevTools knowledge specific to View Transitions.

Common Mistakes:
Forgetting the viewTransition prop on Link elements, which means no transition fires at all. Applying viewTransitionName to elements that change DOM structure during the transition, causing snapshot artifacts. Not testing on low-powered devices where screenshot capture can cause brief visual flashes. Relying on View Transitions for complex animations that the CSS API cannot express cleanly.

Best Practices:
Start with a simple global crossfade and iterate toward element-level transitions progressively as needed. Use @media (prefers-reduced-motion: reduce) to disable all transitions for accessibility. Name view transitions descriptively — viewTransitionName set to a stable, unique identifier per element. Validate behavior in both Chrome and Safari, which have different levels of support.

Conclusion:
ViewTransition brings browser-native GPU-composited navigation animations to React without animation library overhead. For Blog Studio apps and any SPA where navigation smoothness contributes to perceived quality, it represents the simplest path to production-quality transitions — with full control given to CSS and motion accessibility respected by default.`,
  },
  {
    title: 'Fragment Refs: Managing Multi-Node UI as One Logical Surface',
    content: `Title: Fragment Refs: Managing Multi-Node UI as One Logical Surface

Overview:
React 19 allows refs to be attached directly to Fragment elements, returning an array of DOM nodes instead of a single node. This article explains the Fragment ref API, what problems it solves compared to single-node refs, and how to use it for focus management, ARIA coordination, and DOM measurements that span multiple adjacent sibling elements.

Prerequisites:
Familiarity with React refs using useRef, createRef, and callback refs. Understanding of how React attaches refs to host DOM elements and their lifecycle. Basic knowledge of ARIA attributes and focus management patterns for accessible React UIs.

Problem Statement:
Many UI patterns — a group of related list items, a table row, a multi-part form field, a pill tag list — are composed of several sibling DOM nodes that should be treated as one logical unit for focus traversal, ARIA labeling, or resize observation. Previously, devs had to wrap these nodes in a superfluous div just to attach a single ref, adding DOM elements that break CSS Grid and Flexbox layouts.

Concept Explanation:
React 19 extends ref attachment to Fragment and the shorthand empty syntax. When a ref is attached to a Fragment, React populates the ref with an array of the Fragment's direct DOM children rather than a single element. This array is stable across re-renders when the Fragment's children count stays constant. The ref updates when children mount or unmount, following the same lifecycle rules as element refs.

Core API / Syntax:
Attach a ref to a Fragment using the ref prop on the Fragment component. The ref value will be null until mount and an array of Element instances after mount. Type the ref as RefObject containing an array of Element from React. Fragment refs support callback refs and follow the same lifecycle as element refs.

Code Example:
~~~tsx
import { Fragment, useRef, type RefObject } from 'react';

type Tag = { id: string; label: string };

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  const groupRef: RefObject<Element[]> = useRef<Element[]>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const nodes = groupRef.current;
    if (!nodes || !event.target) return;

    const index = nodes.indexOf(event.target as Element);

    if (event.key === 'ArrowRight' && index < nodes.length - 1) {
      (nodes[index + 1] as HTMLElement).focus();
      event.preventDefault();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      (nodes[index - 1] as HTMLElement).focus();
      event.preventDefault();
    }
  };

  return (
    <div role="group" aria-label="Article tags">
      <Fragment ref={groupRef}>
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onKeyDown={handleKeyDown}
            className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700"
          >
            {tag.label}
          </button>
        ))}
      </Fragment>
    </div>
  );
}
~~~

Explanation of Code:
groupRef is populated with the array of button DOM nodes after mount. The handleKeyDown handler finds the currently focused node's index in the nodes array and moves focus left or right with arrow keys — implementing the standard roving focus pattern for keyboard navigation. No wrapper div is added inside the role="group" container, so CSS flexbox layout remains clean. The fragment ref delivers the node array without polluting the DOM structure.

Real-World Use Case:
In a Blog Studio app, article tags appear as a horizontal row of pill buttons. Keyboard users need arrow-key navigation between tags, and screen readers need to announce the group with ARIA. Fragment refs let the roving focus pattern and bounding rect overflow detection be implemented without a wrapper element that would break the flex layout of the tag row or add an unsemantic node to the DOM.

Performance Impact:
Fragment refs add no meaningful overhead compared to element refs. The array population happens once at mount with a cost proportional to the number of fragment children. For groups under 50 nodes, there is no measurable difference from element refs. The array is not recreated on re-render unless children mount or unmount.

When to Use:
Use Fragment refs when you need imperative access to multiple adjacent DOM nodes as a group — for focus management across sibling elements, bounding rect measurement of a multi-node surface, or ARIA coordination between elements that should not be wrapped in a new container element.

When NOT to Use:
Do not use Fragment refs when a single wrapper element is semantically appropriate — a div with role="group" is often both cleaner and more accessible. Do not use them if you only need a ref to one specific child — attach the ref directly to that element. Avoid Fragment refs for dynamic child counts where the array index mapping changes frequently.

Pros:
Eliminates superfluous wrapper elements that break CSS layout primitives such as grid and flexbox. Enables imperative multi-node operations as a single coordinated unit. Follows the same ref lifecycle and callback ref patterns as existing element refs. Provides a stable array reference across re-renders when child count is constant.

Cons:
Returns an array, not a single element — all ref consumers must handle array indexing rather than direct element access. Array elements lose stable identity if children re-order, requiring careful key management. Not useful when only one child needs imperative access. Browser index lookups over the array add minor complexity compared to accessing a single DOM node.

Common Mistakes:
Attaching a fragment ref and expecting ref.current to be a single Element rather than an array of elements. Not handling the null-before-mount case when the ref is first accessed. Using fragment refs with dynamic child lists and relying on stable index-to-element mapping when children reorder. Forgetting to type the ref correctly as RefObject containing an array.

Best Practices:
Type fragment refs explicitly as RefObject containing an array of Element. Always null-check ref.current before iterating over it. Assign stable key props to all fragment children so React can track DOM identity correctly. Only reach for fragment refs when the multi-node surface requirement is genuine and a wrapper element would cause a real layout or semantic problem.

Conclusion:
Fragment refs close a longstanding gap in React's imperative DOM access model. For accessibility engineering, layout measurement, and DOM coordination across sibling elements, they provide a clean alternative to wrapper elements that pollute the DOM structure. Used with care, they make complex keyboard navigation and ARIA patterns significantly simpler to implement correctly.`,
  },
  {
    title: 'React Compiler in Practice: Fewer Memo Hooks, Same Predictable Performance',
    content: `Title: React Compiler in Practice: Fewer Memo Hooks, Same Predictable Performance

Overview:
React Compiler, formerly known as React Forget, is a build-time optimizer that automatically inserts memoization at the correct granularity — eliminating the need to manually write useMemo, useCallback, and React.memo in most cases. This article explains how the compiler works, what guarantees it provides, how to enable it in a Vite and React 19 project, and how to manage existing manual memoization.

Prerequisites:
Solid understanding of useMemo, useCallback, and React.memo. Familiarity with how React detects changes via referential equality checks. Understanding of the role of Babel or SWC in a React project's build pipeline. Vite 6 or later or a framework that supports the React Compiler plugin.

Problem Statement:
Manual memoization in React is error-prone and tedious. Developers add useMemo and useCallback defensively without profiling, forget to update dependency arrays when logic changes, and create cascading prop instability across component trees. The result is either over-memoized code that adds cognitive overhead with no runtime benefit, or under-memoized code that triggers unexpectedly frequent re-renders.

Concept Explanation:
React Compiler analyzes component and hook bodies statically during the build step, identifies which expressions are safe to memoize, and inserts fine-grained memoization automatically into the output bundle. It understands React's Rules — pure renderers, no mutation of props or external state from render logic — and applies memoization at a granularity finer than typical useMemo blocks. The compiler also enforces the Rules of React, reporting violations as build errors rather than silent runtime bugs.

Core API / Syntax:
Enable the compiler via the babel-plugin-react-compiler package integrated into your bundler configuration. For Vite, add the plugin to the babel.plugins array in vite-plugin-react configuration with the target set to 19. No code changes are needed in individual components — the compiler instruments them automatically during the build. Use the "use no memo" string directive in a component to opt it out of compilation.

Code Example:
~~~tsx
import { useState, startTransition } from 'react';
import { useDeferredValue } from 'react';
import { useBlogs } from '@/shared/hooks/useBlogs';

// No useMemo or useCallback needed — React Compiler handles memoization automatically
export function BlogSearch() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { data: blogs = [] } = useBlogs();

  const filtered = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(deferredQuery.toLowerCase()),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setQuery(event.target.value);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search blogs..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <p className="mt-2 text-sm text-gray-500">{filtered.length} results</p>
    </div>
  );
}
~~~

Explanation of Code:
This component writes no useMemo for the filtered array and no useCallback for the change handler. React Compiler detects at build time that filtered depends on blogs and deferredQuery, and inserts memoization automatically with the correct dependency granularity. handleChange is automatically stabilized since its identity only needs to change when startTransition semantics change. The code reads exactly like unoptimized React, but the output bundle has correct, fine-grained memoization applied at compile time.

Real-World Use Case:
In a Blog Studio app, the BlogSearch component was previously written with useMemo for the filtered list and useCallback for the change handler. After enabling React Compiler and removing these hooks, profiling confirmed identical performance in production — the compiler inserted equivalent memoization. The component became 30% shorter and future updates no longer require maintaining dependency arrays, removing a class of bugs entirely.

Performance Impact:
React Compiler's memoization is more granular than typical hand-written useMemo — it can memoize individual expressions rather than entire computation blocks. In benchmarks on large component trees, it achieves parity with expertly hand-memoized code while eliminating common mistakes like stale dependencies that cause unnecessary re-computation. Build time increases slightly due to the static analysis pass proportional to codebase size.

When to Use:
Enable React Compiler by default for all new React 19 projects. Let it handle memoization for components that maintain pure render semantics. Remove existing useMemo and useCallback incrementally as you verify via profiling that compiler output matches the hand-memoized behavior.

When NOT to Use:
Do not rely on the compiler to memoize components that violate the Rules of React — mutating state outside setters, performing side effects in render, or reading mutable external state. Do not remove useMemo from complex imperative computations without verifying via the React Compiler Playground that the compiler handles them correctly. Do not enable it in React 17 or 18 projects without reading the compatibility requirements.

Pros:
Eliminates manual dependency array maintenance — a major source of difficult-to-reproduce bugs. More granular memoization than typical hand-written useMemo blocks. Rules of React violations become build errors rather than silent runtime issues. Measurably reduces component code size in real codebases.

Cons:
Requires a build pipeline change to add the Babel or SWC plugin configuration. Static analysis time increases for large codebases during the build step. Components that violate Rules of React require refactoring before the compiler accepts them. Debugging compiler output requires understanding the transformed code structure.

Common Mistakes:
Adding useMemo after enabling the compiler out of habit — this creates double-memoization and adds overhead rather than reducing it. Expecting the compiler to fix components that mutate props or perform impure renders. Removing all existing useMemo without profiling to confirm equivalent performance. Not using "use no memo" for components intentionally opting out of compilation.

Best Practices:
Enable the compiler project-wide and let it report Rules of React violations at build time as the first step. Remove manual memoization incrementally and verify behavior with the React DevTools Profiler after each removal. Use the React Compiler Playground online to inspect how specific components are transformed. Keep components pure — the compiler's optimization power is directly proportional to the purity and predictability of the input code.

Conclusion:
React Compiler makes the right memoization behavior the default rather than the expert's responsibility. For React 19 projects, enabling it from the start reduces code complexity, eliminates an entire class of dependency array bugs, and unlocks finer-grained optimization than manual memoization typically achieves — with no ongoing maintenance overhead.`,
  },
  {
    title: 'React Server Components (RSC): Moving Data Work Off the Client',
    content: `Title: React Server Components (RSC): Moving Data Work Off the Client

Overview:
React Server Components are components that run exclusively on the server with direct access to databases, file systems, and backend services — and contribute zero JavaScript to the client bundle for their implementation. This article explains the RSC execution model, the server and client component boundary, how data flows between them, and the practical patterns for building data-driven UIs.

Prerequisites:
Solid understanding of server-side rendering and its limitations around bundle size and client-side waterfalls. Familiarity with React Suspense and streaming. Basic knowledge of a server runtime such as Node.js and database query patterns. Exposure to the Next.js App Router or another RSC-capable framework.

Problem Statement:
Client components must fetch data over the network, serialize it, deserialize it on the client, and render it — adding latency, bundle size, and complexity. Libraries like React Query solve caching and synchronization but do not eliminate the network round trip. Large components bundled client-side ship logic that only executes to process a single data fetch. The result is heavier bundles, slower interactions, and complex client-side data orchestration for work that is fundamentally server-side.

Concept Explanation:
React Server Components run in a server environment and produce a serialized component tree — the RSC payload — rather than HTML strings. Client components hydrate from this payload. Server Components can await database queries or file reads directly in their render function body — no API route, no useEffect, no fetch call needed. Their implementation code is never shipped to the browser. Client Components are explicitly marked with the "use client" directive and hydrate in the browser with full interactivity. Data flows from server to client as props through the component tree.

Core API / Syntax:
Server Components are the default in the Next.js App Router — any component file without "use client" is a Server Component. Use async/await directly in Server Component bodies for data fetching. Place "use client" at the top of files that need browser APIs, React state, or event handlers. Pass server-fetched data as plain serializable props to client components.

Code Example:
~~~tsx
import { db } from '@/lib/db';
import { BlogCard } from './BlogCard';

export async function BlogListServer() {
  const blogs = await db.blog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });

  if (blogs.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">
        No articles published yet.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {blogs.map((blog) => (
        <li key={blog.id}>
          <BlogCard
            id={blog.id}
            title={blog.title}
            author={blog.author.name}
            createdAt={blog.createdAt.toISOString()}
          />
        </li>
      ))}
    </ul>
  );
}
~~~

Explanation of Code:
BlogListServer is an async Server Component that queries the database directly using Prisma. No API route is created — the component itself is the data layer. The query result maps to plain serializable props passed to BlogCard, which can be either a Server Component rendered statically or a client component with hover state. The database query implementation code is never shipped to the browser — only the rendered RSC payload reaches the client.

Real-World Use Case:
In a Blog Studio app, the blog list page previously required a REST API route, a React Query hook, loading state management, and error boundary configuration — five separate files for one data operation. With RSC, BlogListServer queries the database directly and renders the list in a single file, eliminating the API route and the client-side hook entirely. The page loads faster because there is no client-side fetch waterfall waiting after hydration.

Performance Impact:
RSC eliminates the client-side fetch waterfall for the initial page load. Database round trips happen on the server where latency is measured in microseconds rather than network milliseconds. The RSC payload is smaller than an equivalent JavaScript bundle because server component implementations are never included in what ships to the browser. Streaming with Suspense means the browser receives and renders RSC output progressively rather than waiting for all data to resolve.

When to Use:
Use Server Components for data fetching that does not require browser APIs or interactive event handlers. Use them for components that read from databases, file systems, or internal APIs and render primarily static or infrequently interactive UI. Use them as the outer shell of a page with Client Components nested inside for the interactive parts.

When NOT to Use:
Do not use Server Components for components that need useState, useEffect, browser events, or localStorage access — these require "use client". Do not use them for highly interactive UI like form fields, modals, or inline editing. Do not attempt to use RSC in a vanilla Vite SPA without a server-side framework providing the RSC infrastructure.

Pros:
Zero JavaScript bundle contribution from Server Component implementations. Direct database and filesystem access without API routes. Automatic streaming with Suspense for progressive browser rendering. Simpler data flow — no fetch hooks, no client loading states, no cache management for server reads.

Cons:
Requires a server runtime — cannot be deployed as a fully static SPA. The server-client component boundary adds architectural complexity to component design decisions. Debugging server-side rendering errors requires access to server logs. Framework support is currently concentrated in Next.js App Router.

Common Mistakes:
Importing client-side libraries containing browser APIs into Server Components. Passing non-serializable data such as class instances or functions from Server Components to Client Components as props. Forgetting "use client" on components that need interactivity, causing confusing hydration errors. Treating RSC as equivalent to traditional SSR — they have fundamentally different execution and payload models.

Best Practices:
Keep the server-client boundary explicit — document which components are Server and which are Client. Pass only serializable data — strings, numbers, plain objects and arrays — across the boundary. Use Suspense to stream Server Component outputs progressively, providing immediate skeleton feedback. Profile the RSC payload size alongside JavaScript bundle size to measure total data transfer impact.

Conclusion:
React Server Components represent a fundamental shift in how data work is distributed in React applications. By moving data fetching to the server and eliminating the associated client JavaScript, RSC reduces bundle size, eliminates network waterfalls, and simplifies data architecture — while preserving full React interactivity through explicit client component boundaries where interaction is genuinely needed.`,
  },
];
