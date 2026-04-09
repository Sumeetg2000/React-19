# React 19 Frontend Showcase Execution Plan

Date: 2026-04-03

## Sources used

- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useTransition
- https://react.dev/reference/react/useDeferredValue
- https://react.dev/reference/react/useEffectEvent
- https://react.dev/reference/react/ViewTransition

## Important compatibility note

- React `<ViewTransition />` is currently canary/experimental and is not available in stable React 19.2 used in this project.
- Execution will use router-level `viewTransition` navigation options where supported for progressive enhancement, while explicitly skipping canary-only `<ViewTransition />`.

## Execution steps

1. Add explicit inline comments at each existing React 19 API usage site:
   - `useActionState`
   - `<form action={...}>`
   - `useFormStatus`
   - `useTransition` and `startTransition`
   - `useDeferredValue`
   - `lazy` and `Suspense` boundaries
2. Add practical `useEffectEvent` usage in an effect-driven auth-sync listener to avoid stale closures.
3. Add route/navigation view transition hints where applicable via router navigation APIs.
4. Keep components pure and avoid adding unnecessary memoization.
5. Add focused tests for action-based auth mutations (`loginAction`, `signupAction`).
6. Validate with `npm run build` and `npm test -- --runInBand`.

## Out-of-scope or skipped

- `<ViewTransition />` component: skipped because the project uses stable React channel.
- Fragment refs: skipped because no grouped DOM imperative access is needed.
- `captureOwnerStack`: skipped because no new error-boundary debugging path is introduced.
