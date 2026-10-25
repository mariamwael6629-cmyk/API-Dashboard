# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the README and `frontend/src`. The owner asked the redesign to proceed on inferred context; treat each line as an assumption until confirmed.

## Platform

web

## Users
Backend and platform engineers who wire third-party APIs (OpenAI, Stripe, GitHub, Slack, Discord, Google, custom) into their product and need one place to watch traffic, test requests and manage keys. They keep it open on a second screen.

## Product Purpose
Nexora puts many APIs behind unified endpoints. App: dashboard with live traffic, analytics, a provider marketplace with connection modals and request logs, a testing lab (request builder, JSON viewer, snippets, history), a workflow builder, an AI assistant, team, billing and settings (API keys, env vars). Landing page and login come first. React 19 + Vite + Tailwind v4; FastAPI backend.

## Positioning
One control room for every API your product calls.

## Capabilities and Constraints
- Tailwind v4 `@theme` tokens in `src/index.css`; most components use Tailwind palette classes (slate, cyan, violet, lime, rose, amber), so the palette is re-mapped at the theme level.
- Landing stats, testimonials and prices are marketing placeholders.

## Brand Commitments
- Name "Nexora".

## Product Principles
1. Status first: what is up, what is slow, what is failing.
2. Dense but legible; numbers line up.
3. Calm by default, loud only for failures.
