# Nexora design system: "Container terminal"

Nexora takes many providers and loads them onto one endpoint, which is what a
container terminal does with cargo. The landing is the quay by day (concrete,
painted containers, a gantry crane). The app is the terminal at night: harbour
black with lamp-lit greys and container colours for status.

## Where the tokens live
`frontend/src/index.css` `@theme`. The components use Tailwind palette
classes (slate, cyan, violet, lime, rose, amber, fuchsia), so those palettes
are re-mapped in the theme instead of editing every class:

| Palette | Becomes | Use |
|---|---|---|
| `void-*` | `#0F1416` to `#2C393E` | app surfaces (harbour night) |
| `slate-*` | warm greys `#F4F2ED` to `#64625D` | app text |
| `cyan-*` | container rust `#D9622B` / `#E57F45` / `#F0A47A` | primary accent, active nav, main chart line |
| `violet-*` | sea blue `#62A3C8` | secondary series, info |
| `lime-*` | container green `#52B585` | success, healthy |
| `amber-*`, `fuchsia-*` | gantry yellow `#F2C14E` | warnings, secondary chart series |
| `rose-*` | alarm red `#E0533D` | errors |
| `brand` | `#C4511F` | landing primary button |
| `canvas` / `surface` / `border` / `ink` | `#F1F0EB` / `#E7E5DE` / `#D3CFC4` / `#16191B` | landing (concrete quay) |

Radii are tightened (`lg` 6px, `xl` 8px, `2xl` 10px). No gradients outside
chart area fills; the old cyan-to-violet gradients are flat colours now.

## Type
Saira Condensed for headings and big numbers, Saira for UI, JetBrains Mono for
request data, Saira Stencil One only for container and ship lettering in the
hero illustration.

## Components
- `Button` gains an `outline` variant for the light landing (ink border).
- Landing nav: 2px ink rule, no blur.
- Background grid is a square 48px quay grid, not dots.
- Mobile bottom nav is solid `void-800`.

## Motion
Landing hero: the gantry trolley carries a container from the yard to the
ship and back (7s loop), skipped under `prefers-reduced-motion`.
