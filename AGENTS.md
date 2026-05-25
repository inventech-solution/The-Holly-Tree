# AGENTS.md — Contributor Guide for The-Holly-Tree

This repository is a Shopify OS 2.0 theme (Horizon-based). Use this guide when making changes.

## 1) Project layout (what lives where)

- `layout/` — global page shell (`theme.liquid`) and document-level includes.
- `templates/` — route templates (`product`, `collection`, `cart`, etc.), mostly JSON templates that compose sections.
- `sections/` — reusable page sections rendered by templates.
- `snippets/` — smaller Liquid partials shared by sections/templates.
- `blocks/` — theme block definitions used in section groups and templates.
- `assets/` — frontend JS/CSS plus static assets (SVG icons, etc.).
- `locales/` — translation files (`*.json`) and schemas (`*.schema.json`).
- `config/` — `settings_schema.json`, `settings_data.json`, and theme config.

When updating a feature, prefer the smallest surface area change in the appropriate folder.

## 2) Core development principles

- Preserve server-rendered behavior with Liquid first; use JavaScript as progressive enhancement.
- Keep changes lean and purpose-driven; avoid introducing broad abstractions for single-use behavior.
- Favor semantic HTML and accessibility-friendly markup (labels, roles, keyboard behavior).
- Do not move business logic that belongs in Liquid/translations into client-side JS.

## 3) Editing conventions by file type

### Liquid (`.liquid`)

- Maintain existing whitespace/style in the touched file.
- Reuse existing snippets/section patterns before adding new ones.
- Keep schema/settings names clear and merchant-friendly.

### JavaScript (`assets/*.js`)

- Follow existing module/class style already used in `assets/`.
- Avoid adding heavy dependencies or polyfill-like code.
- Keep DOM queries scoped and event listeners cleaned up when relevant.

### CSS (`assets/*.css`)

- Extend existing tokens/utilities before adding one-off styles.
- Prefer component-scoped selectors over broad global overrides.

### Locales (`locales/*.json`)

- Add/modify keys consistently across languages when changing customer-facing text.
- Keep key paths stable; avoid renaming existing keys unless required.

## 4) Validation checklist before commit

Run what is relevant to your change:

1. `shopify theme check` (preferred lint/static validation).
2. If Shopify CLI is unavailable, do at least targeted sanity checks (JSON validity, Liquid/asset syntax around touched files).
3. Review changed templates/sections for missing translation keys and broken snippet references.

## 5) Commit and PR expectations

- Keep commits focused and atomic.
- Write commit messages in imperative mood and include the main scope.
  - Example: `Improve product card price accessibility labels`
- In PR descriptions, include:
  - Motivation/problem.
  - What changed.
  - How it was validated (commands and outcomes).

## 6) Guardrails for agents

- Do not perform unrelated refactors while addressing a specific request.
- Do not add license headers or reformat untouched files wholesale.
- Prefer backward-compatible edits; call out unavoidable breaking changes explicitly.
- If a command/tool is unavailable in the environment, note it clearly in the final report.
