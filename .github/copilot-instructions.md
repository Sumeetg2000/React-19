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

## React 19 Rules

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
