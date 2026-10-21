---
name: DoeMais Mobile System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-sm: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is built specifically for mobile-first NGO donation management and field inventory logistics. It serves volunteers, warehouse coordinators, and social workers operating in dynamic, sometimes chaotic environments where clarity, speed, and immediate feedback are paramount.

The brand personality centers on three pillars:
- **Radical Clarity:** Information density must never compromise legibility. High-contrast typography and clear visual semantics ensure operations can be conducted under direct sunlight or in dimly lit distribution hubs.
- **Warm Reliability:** Grounded by deep slate neutrals and energized by an optimistic emerald green, the interface evokes institutional trust, compassion, and organized action.
- **Mobile-Native Tactility:** Designed to feel fluid, native, and responsive, with exaggerated touch targets, distinct tap states, and card-centric layouts built for one-handed operation.

The visual style blends **Modern Clean Surfaces** with **Subtle Tonal Depth**. Crisp white and off-white cards float above a soft slate canvas, bordered by ultra-subtle dividers, avoiding visual clutter while delivering effortless visual categorization.

## Colors

The palette establishes an immediate operational hierarchy, prioritizing legibility and status communication above decorative flourishes.

### Core Roles
- **Primary (`#10B981` Emerald):** Represents action, surplus, verified donations, and active tracking states. Used for primary CTAs, positive status indicators, active tabs, and confirmation checkpoints.
- **Secondary / Slate Navy (`#0F172A` Slate 900):** Anchors the interface. Used for deep structure, headers, critical body text, and dark persistent bottom navigation bars. Provides optimal contrast against light backdrops.
- **Neutral Canvas (`#F8FAFC` Slate 50 / `#F1F5F9` Slate 100):** Forms the foundational background layers to mitigate visual fatigue during extended inventory logging sessions. Pure white (`#FFFFFF`) is reserved exclusively for card surfaces and elevated modals.
- **Surface Borders (`#E2E8F0` Slate 200):** Hairline outlines separating list groups and card boundaries.

### Semantic Status Badges
Status tokens are purpose-built for warehouse triage and perishable tracking:
- **Normal / Em Estoque:** Emerald green badge (`bg: #ECFDF5`, `text: #047857`, `border: #A7F3D0`).
- **Estoque Baixo:** Amber/Warm orange badge (`bg: #FFFBEB`, `text: #B45309`, `border: #FDE68A`).
- **Vencimento Próximo / Crítico:** Coral crimson badge (`bg: #FEF2F2`, `text: #B91C1C`, `border: #FECACA`).

## Typography

The typography uses **Plus Jakarta Sans** uniformly across headlines, body, and labels. Its friendly curves soften operational interfaces while its geometric underpinnings provide strong numerals and data alignment when scanning inventory counts, unit measures, and lot numbers.

- **Headings (`headline-lg-mobile`, `headline-md`):** High visual weight (`700`), crisp tracking, used for donation batch totals, screen anchors, and summary dashboards.
- **Data & Item Labels (`title-md`):** Used for item names (e.g., "Arroz Tipo 1 - 5kg", "Kit Higiene Pessoal").
- **Body (`body-md`, `body-sm`):** Set at high-contrast `#0F172A` on `#FFFFFF` cards, dropping to `#475569` (Slate 600) only for secondary metadata, timestamps, or donor notes.
- **Badges & Labels (`label-sm`):** Uppercase tracking (+0.5px) with `700` weight to ensure instant readability of expiration warnings.

## Layout & Spacing

The layout is built on an 8pt spatial grid configured for mobile devices and handheld warehouse tablets.

### Grid & Margins
- **Canvas Margins:** Fixed `16px` (`margin`) outer horizontal inset on mobile viewports (≤480px). Expanded to `24px` on tablet views.
- **Column Structure:** Single-column layout on standard mobile screens, transitioning into a 2-column card grid on tablets (≥768px).
- **Safe Area Insets:** Strict adherence to mobile bottom home indicator (`padding-bottom: env(safe-area-inset-bottom, 24px)`) and top status bar zones.

### Spatial Rhythm
- **Component Padding:** Standard cards use `space-md` (16px) internal padding. Compact list items use `space-sm` (8px) vertical and `space-md` (16px) horizontal padding.
- **Touch Targets:** All interactive zones maintain a minimum clickable footprint of `48px x 48px`, regardless of visual icon size.

## Elevation & Depth

Visual hierarchy is constructed through soft, ambient shadows tinted with dark slate (`#0F172A`), avoiding generic muddy blacks. Surfaces remain airy while retaining distinction from the background.

### Elevation Levels
- **Level 0 (Canvas):** `#F8FAFC`. Base background level for views and scrolling content.
- **Level 1 (Cards & Feed Items):** Pure `#FFFFFF` surface paired with `box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 3px -1px rgba(15, 23, 42, 0.03)` and a hairline border (`1px solid #E2E8F0`).
- **Level 2 (Active Cards & Floating Menus):** Pure `#FFFFFF` with `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Sticky Action Bars & Modals):** Floating bottom navigation and bottom sheets use `box-shadow: 0 -4px 16px -1px rgba(15, 23, 42, 0.06)`, anchored with a frosted glass backdrop filter (`backdrop-filter: blur(12px); background-color: rgba(255, 255, 255, 0.92)`).

## Shapes

The design uses generous corner rounding (`rounded-xl` and `rounded-2xl`) tailored for a modern, tactile mobile aesthetic.

- **Cards & Modals (`rounded-2xl` / 16px):** Donation cards, item details panels, and bottom sheets adopt a smooth 16px border radius to soften content boundaries.
- **Buttons & Input Fields (`rounded-xl` / 12px):** Standard text inputs, numeric steppers, and interactive primary actions use 12px corners for comfortable finger placement.
- **Status Badges & Quick Action Chips (`rounded-full` / Pill-shape):** Micro-indicators, search filters, and status tags are fully rounded pill shapes to distinguish them from actionable square-corner elements.

## Components

### Buttons
- **Primary Action (React Native Native Feel):** Height of `52px` to maximize thumb reach. Solid Emerald (`#10B981`) background, bold white typography (`label-lg`), `rounded-xl` (12px). Active feedback includes scale depression (`transform: scale(0.98)`) and brightness shift to `#059669`.
- **Secondary / Ghost:** Height of `52px`, bordered by `1.5px solid #CBD5E1`, with Slate 900 text.
- **Floating Bar CTA:** Pinned to bottom of screen with safe area padding, spanning full screen width minus horizontal margins.

### Status Badges (Pills)
- Rendered as inline pills with `padding: 4px 10px`, `rounded-full`, and typography `label-sm`.
- **Normal:** Emerald tint background (`#ECFDF5`), Emerald dark text (`#047857`), 1px border (`#A7F3D0`). Includes a 6px green circular status dot.
- **Estoque Baixo:** Amber background (`#FFFBEB`), Amber dark text (`#B45309`), 1px border (`#FDE68A`).
- **Vencimento Próximo:** Coral red background (`#FEF2F2`), Deep red text (`#B91C1C`), 1px border (`#FECACA`).

### Cards & Inventory List Items
- **Inventory Card:** Pure white background, `16px` padding, `16px` border radius (`rounded-2xl`). Contains item title (`title-md`), category label (`label-md`), numeric quantity display with prominent font weight, expiration badge, and right chevron for drill-down.
- **Quick Action Stepper inside Card:** Integrated `+` and `-` quantity adjustment buttons, sized at `44x44px` minimum with light slate background (`#F1F5F9`) for rapid warehouse audits.

### Inputs & Search Bars
- **Search & Filter Field:** Height of `48px`, `rounded-xl`, filled with `#F1F5F9` background, `0` border by default, switching to `2px solid #10B981` on active focus. Prefix barcode scanner icon button (`48x48px` touch target) on the right side.
- **Form Inputs:** Prominent label (`label-md`) above input, placeholder in `#94A3B8`, text in `#0F172A`.

### Donation Metric Stat Cards
- Highlight key warehouse metrics (e.g., "Kilos Arrecadados", "Itens Vencendo Hoje"). High-contrast slate number (`headline-lg-mobile`), paired with a primary emerald micro-bar or trending indicator.