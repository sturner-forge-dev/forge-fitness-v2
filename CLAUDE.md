# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

This is a TypeScript project using TanStack Router, TanStack Form (prefer `useField` hook over render props), Prisma, and Tailwind CSS. Avoid `as any` casts and Biome suppressions — find the proper typed approach.

## Rules

- Do NOT start the dev server or run long-running processes unless explicitly asked. Ask before running any server commands.
- When unsure about the codebase architecture, ASK the user instead of autonomously exploring. Minimize token usage on exploration.

## Commands

```bash
npm run dev          # Start dev server on port 3000 (loads .env.local automatically)
npm run build        # Production build
npm run check        # Biome lint + format check (run before committing)
npm run lint         # Biome lint only
npm run format       # Biome format only
npm run test         # Vitest (run all tests)

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema changes to DB (no migration history)
npm run db:migrate   # Create and apply a migration (use for tracked changes)
npm run db:seed      # Seed the database from prisma/seed.ts
npm run db:studio    # Open Prisma Studio (visual DB editor)
```

All `db:*` scripts automatically inject `DATABASE_URL` from `.env.local` via `dotenv-cli`. Never run `prisma` directly — it won't have the env var.

To add a shadcn component:

```bash
pnpm dlx shadcn@latest add <component>
```

Components land in `src/components/ui/`.

## Architecture

**Stack**: TanStack Start (React 19 full-stack meta-framework) + TanStack Router (file-based) + Prisma + PostgreSQL (Neon serverless) + Tailwind v4 + Clerk auth + Biome

### Routing

File-based via TanStack Router. Files in `src/routes/` become routes automatically — `__root.tsx` is the shell layout (Header, Footer, Clerk provider, devtools). The route tree is auto-generated into `src/routeTree.gen.ts`; never edit this file directly.

Use TanStack Router `<Link>` components instead of plain `<a>` tags for all internal navigation.

Route definition pattern:

```ts
export const Route = createFileRoute("/path")({
  loader: () => myServerFn(), // runs on server before render
  component: MyComponent,
});

function MyComponent() {
  const data = Route.useLoaderData(); // typed, no extra fetch needed
}
```

### Server Functions

`createServerFn` runs exclusively on the server. Call them from loaders or directly from client event handlers:

```ts
const getThings = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    return prisma.thing.findUnique({ where: { id: data.id } });
  });
```

Per `.cursorrules`: wrap expensive server fn handlers with `Sentry.startSpan({ name: 'op-name' }, async () => { ... })` for distributed tracing.

# Note

Sentry has not been enabled in this repository yet. Will update this document when that changes.

### Database

Single Prisma client exported from `src/db.ts` — import it everywhere:

```ts
import { prisma } from "#/db";
```

Schema lives in `prisma/schema.prisma`. Generated client outputs to `src/generated/prisma/` (do not edit). After any schema change: `npm run db:generate`, then `npm run db:push` (dev) or `npm run db:migrate` (tracked change).

The seed file (`prisma/seed.ts`) loads `db/dist/exercises.nd.json` — a newline-delimited JSON file of ~873 exercises from the free-exercise-db. It batch-inserts in groups of 100.

### Styling

All styles flow through `src/styles.css` (Tailwind v4 via vite plugin). Design tokens are CSS custom properties defined in `:root` and overridden in `.dark`.

When modifying CSS or Tailwind classes, check for specificity conflicts in global stylesheets before assuming the fix is complete. Be aware that tailwind-merge may strip classes that conflict with base component styles.

| Token                           | Usage                  |
| ------------------------------- | ---------------------- |
| `--sea-ink`                     | Primary text           |
| `--sea-ink-soft`                | Secondary/muted text   |
| `--lagoon-deep`                 | Accent/link color      |
| `--palm`                        | Success/beginner badge |
| `--line`                        | Borders                |
| `--surface`, `--surface-strong` | Card backgrounds       |

Use them in Tailwind classes as `text-(--sea-ink)`, `border-(--line)`, etc.

Reusable CSS utility classes defined in `styles.css`:

- `.island-shell` — frosted-glass card style (border + gradient background + box-shadow)
- `.feature-card` — card with hover lift effect
- `.island-kicker` — small all-caps label above headings
- `.display-title` — Fraunces serif font for hero headings
- `.rise-in` — fade+slide-up entrance animation
- `.page-wrap` — centered content container (max 1080px)
- `.nav-link` — nav link with animated underline

Dark mode is toggled by adding/removing the `.dark` class on `<html>`. Theme preference is persisted to `localStorage` and applied by an inline script in `__root.tsx` (before first paint, to avoid flash).

### Path Aliases

Both `#/` and `@/` resolve to `src/`:

```ts
import { prisma } from "#/db";
import { Button } from "#/components/ui/button";
```

shadcn components use `#/` — prefer that for consistency.

## UI / Components

Always use shadcn/ui components when building UI. Do not use raw HTML elements or custom implementations when a shadcn component exists.

### UI Components

Shadcn components in `src/components/ui/` currently available:
`button`, `input`, `label`, `select`, `slider`, `switch`, `table`, `textarea`

Use `Button` variants: `default`, `outline`, `secondary`, `ghost`, `link`, `destructive`  
Use `Button` sizes: `default`, `sm`, `lg`, `xs`, `icon`

The `cn()` utility from `#/lib/utils` merges Tailwind classes (clsx + tailwind-merge).

### Forms

All forms use **TanStack Form v1**. Never manage form state with `useState`.

Each form domain gets its own hook file using `createFormHookContexts` + `createFormHook`:

```ts
// e.g. src/components/Workouts/workout-form.ts
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});
```

**In the top-level form component** — use `useAppForm`, wrap the return in `<form.AppForm>`:

```tsx
const form = useAppForm({
  defaultValues: { ... } satisfies MyFormData,
  onSubmit: async ({ value }) => { ... },
});

return (
  <form.AppForm>
    {/* children */}
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => <Button disabled={isSubmitting}>Submit</Button>}
    </form.Subscribe>
  </form.AppForm>
);
```

**In child components** — use `withForm` so the `form` prop is properly typed, and `useField` for individual field access:

```tsx
export const MyFieldGroup = withForm({
  defaultValues: { ... } satisfies MyFormData, // used for type inference only
  props: { someExtra: '' as string },
  render: ({ form, someExtra }) => {
    const nameField = useField({ form, name: 'fieldName' });
    return <Input value={nameField.state.value} onChange={(e) => nameField.handleChange(e.target.value)} />;
  },
});
```

Key rules:

- Use `useField` (hook) for reading/writing individual fields — flat, no render-prop nesting.
- Use `form.Field` with `mode="array"` only when you need array mutation methods (`pushValue`, `removeValue`). Prefer `useField` with `mode: 'array'` instead.
- Template literals with `number` indices (`` `items[${i}].name` ``) satisfy `DeepKeys<T>` — no `as any` casts needed.
- `form.Subscribe` for reactive reads that drive JSX outside a field (e.g. submit button disabled state).
- Never default to suppressing Biome errors with `biome-ignore` — address the underlying issue instead. If there is a solid reason for suppressing an error, explain the reasoning.

### Plan

The roadmap for this project is located at "./PLAN.md". Any agent should not execute steps in this plan without the user prompting for changes.
The plan should be used as a reference for feature implementations, but is subject to change.
