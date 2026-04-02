---
description: "Execution rules for React 19 initialization agent workflow with strict step validation"
applyTo: "**"
---

# React 19 Initialization Execution Rules

1. Execute one step at a time.
2. Validate each step immediately.
3. Do not continue on failed validation.
4. Fix failures before the next step.
5. Do not skip required steps.

## React 19 Usage Rules

Ensure all generated code uses modern React 19 patterns where applicable.

### Data Fetching

- Prefer React Query for server state.
- Do not use `useEffect` for basic data fetching.

### Forms & Mutations

- Use `useActionState` for form handling.
- Use `<form action={...}>` pattern for form submissions.
- Use `useFormStatus` for loading state inside forms.
- Do not use `useState` for form inputs.

### Performance & Concurrency

- Use `startTransition` for filtering, search, and non-blocking UI updates.
- Use `useDeferredValue` for search inputs and expensive computations.

### Component Design

- Keep components pure.
- Avoid unnecessary memoization — React Compiler handles it automatically.

### Suspense Readiness

- Prefer Suspense-compatible patterns.
- Keep async boundaries clean.

### Strict Rules

- Do NOT use legacy patterns when modern React 19 APIs apply.
- Prefer React 19 APIs over older alternatives.

## React Compiler Rules

1. React Compiler configuration is mandatory and first.
2. Avoid unnecessary memoization unless performance evidence exists.

## Styling Rules

1. Use Tailwind CSS only for application styling.
2. Prefer utility-first classes.
3. Do not use inline styles.
4. Do not use `style={{}}`.

## Constraints

1. Do not use `any`.
2. Do not leave incomplete files.
3. Do not use inline styles anywhere.
4. Tailwind must be used for styling.
5. Finish only when all required validations pass.
