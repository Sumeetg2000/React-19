---
name: auth
description: "Use when: creating or updating routes, setting up navigation, implementing protected routes, handling authentication-based redirects, or integrating login/signup flows with routing"
applyTo: "src/**"
---

# Auth Feature Implementation

Implement authentication with React 19 form APIs and routing protection.

## Goal

Deliver auth pages plus reusable protection and redirect behavior for private routes.

## Required Structure

- `src/features/auth/types/auth.ts`
- `src/features/auth/actions/login.action.ts`
- `src/features/auth/actions/signup.action.ts`
- `src/features/auth/components/SubmitButton.tsx`
- `src/features/auth/components/ProtectedRoute.tsx`
- `src/features/auth/pages/LoginPage.tsx`
- `src/features/auth/pages/SignupPage.tsx`
- Router updates in `src/routes/router.tsx`

## Authentication Model

- Use a simple boolean auth check: `isAuthenticated`.
- The check may come from context/store/hook, but it must resolve to a boolean.

## React 19 Form Requirements

- Use `useActionState` for auth forms.
- Use `<form action={action}>` for submissions.
- Use `useFormStatus` for submit/loading UI.
- Do not use `useState` for form input values.

## Action Handler Behavior

- Handle form submission through action functions.
- Return action state with success or error.
- Display feedback to the user for both success and error paths.

## Protected Route Requirements

Create a reusable `ProtectedRoute` component.

- Accept children and an `isAuthenticated` boolean.
- If `isAuthenticated` is `false`, redirect to `/login`.
- If `isAuthenticated` is `true`, render children.

Example pattern:

```tsx
import type { ReactElement, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  isAuthenticated: boolean
  children: ReactNode
}

export function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps): ReactElement {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
```

## Routing Integration Requirements

### Root Redirect

Root route (`/`) must redirect based on auth state:

- Redirect to `/login` if not authenticated.
- Redirect to `/` (or default private route) if authenticated.

### Private Route Wrapping

- Wrap all private routes with `ProtectedRoute`.
- Unauthenticated access to private routes must redirect to `/login`.

### Auth Routes

- Include `/login` route.
- Include `/signup` route.

### Post-Auth Navigation

- After successful login/signup, navigate to `/`.

## Output Contract

The generated implementation must always include:

- Login page
- Signup page
- Auth actions
- ProtectedRoute
- Routing updates with protection and root redirect logic

## Coding Rules

- Tailwind CSS only for styling.
- No inline styles.
- Strict TypeScript, no `any`.
- Keep implementation modular and reusable.
