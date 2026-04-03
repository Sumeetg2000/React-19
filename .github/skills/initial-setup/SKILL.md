---
name: initial-setup
description: "Use when initializing a complete React 19 application with Vite, strict TypeScript, React Compiler-first setup, Tailwind CSS setup, routing, data layer, UI foundation, and test validation"
---

# Initial Setup Skill

The agent performs a complete React 19 setup atomically.

## Required Scope

1. Initialize Vite + React + TypeScript (strict).
2. Install required packages:
   - `tailwindcss`
   - `postcss`
   - `autoprefixer`
   - `react-router-dom`
   - `@tanstack/react-query`
   - `axios`
   - `antd`
   - `babel-plugin-react-compiler`
   - `jest`
   - `@testing-library/react`
   - `@testing-library/jest-dom`
3. Configure, in order:
   - React Compiler first in `vite.config.ts`
   - Tailwind CSS setup
   - Feature-based folder structure
   - Path alias `@/`
   - Lazy-loaded routing
   - React Query provider
   - Axios instance with interceptors
   - Ant Design setup
   - Jest + RTL with a working test

## Tailwind CSS Setup

The agent installs and configures Tailwind CSS before finishing styling work.

1. The agent installs `tailwindcss`, `postcss`, and `autoprefixer`.
2. The agent initializes Tailwind configuration files.
3. The agent configures content paths for application source files.
4. The agent adds Tailwind directives to global CSS.
5. The agent ensures styling is implemented with Tailwind utility classes.

## Styling Constraints

1. The agent does not use inline styles anywhere.
2. The agent does not use `style={{}}`.
3. The agent uses Tailwind CSS only for styling.
4. The agent prefers utility-first classes.

## Rules

1. Third-person instructions.
2. Atomic execution.
3. No `any`.
4. No incomplete files.
5. No inline styles anywhere.
6. Tailwind must be used.
7. If React Compiler config is incorrect, the agent fixes it before finishing.

## Final Validation

1. `npm run dev` starts.
2. No TypeScript errors.
3. Tests pass.
4. Tailwind styles are applied correctly.
5. No inline styles are present.
