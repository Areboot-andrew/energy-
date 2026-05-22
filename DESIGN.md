---
name: Voltage & Minimal
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c7c9ab'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#909378'
  outline-variant: '#464932'
  surface-tint: '#bbd200'
  primary: '#ffffff'
  on-primary: '#2d3400'
  primary-container: '#d5f000'
  on-primary-container: '#5e6b00'
  inverse-primary: '#586400'
  secondary: '#c8c6c9'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#ffffff'
  on-tertiary: '#303037'
  tertiary-container: '#e3e1ea'
  on-tertiary-container: '#64646b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d5f000'
  primary-fixed-dim: '#bbd200'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#424b00'
  secondary-fixed: '#e4e1e5'
  secondary-fixed-dim: '#c8c6c9'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#e3e1ea'
  tertiary-fixed-dim: '#c7c5ce'
  on-tertiary-fixed: '#1b1b21'
  on-tertiary-fixed-variant: '#46464d'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system embodies the precision of high-end electrical engineering fused with the clean, functional aesthetics of Scandinavian minimalism. It targets commercial and residential clients seeking turnkey solutions where reliability is paramount. 

The visual language draws heavily from modern IT product design—utilizing high-contrast interfaces, ample negative space, and a "Dark Mode first" philosophy to emphasize the "glow" of electrical energy. The emotional response should be one of absolute trust, technological sophistication, and surgical efficiency.

**Design Style: Scandinavian High-Tech**
- **Minimalism:** Use whitespace (or "dark space") to separate complex technical data.
- **Precision:** Mathematical alignment and consistent internal padding.
- **Vibrancy:** Neon accents against deep backgrounds to simulate light and current.

## Colors
The palette is dominated by **Deep Charcoal** and **Jet Black** to provide a high-contrast foundation that feels premium and tech-focused. 

- **Primary (Electric Yellow):** Used exclusively for calls to action, active states, and highlighting key metrics. It represents energy and focus.
- **Neutrals:** A scale of zinc and slate greys (Zinc-900 to Zinc-400) creates depth without introducing unwanted hues.
- **Functional Colors:** Success (Emerald), Error (Rose), and Info (Sky) should be used sparingly, following the same high-saturation logic as the primary yellow.

Surface hierarchy is built by layering progressively lighter shades of charcoal over the black base.

## Typography
We use **Inter** for all applications to ensure maximum legibility and a systematic, modern feel. The typeface’s large x-height and neutral design support the high-tech aesthetic perfectly.

**Implementation Rules:**
- **Ukrainian Support:** Ensure the Cyrillic glyphs utilize the standard Inter metrics.
- **Headlines:** Use tight letter-spacing (-0.02em) for large displays to create a "locked-in" professional look.
- **Labels:** Use uppercase with slight tracking for technical labels, status indicators, and micro-copy to differentiate from body text.
- **Contrast:** Maintain a strict hierarchy where headlines are always pure white (#FFFFFF) and body text is slightly muted (#A1A1AA) to reduce eye strain on dark backgrounds.

## Layout & Spacing
The layout follows a strict **8px grid system**. The philosophy is "structured breathing room"—large margins on the outside with very tight, logical grouping of technical data on the inside.

**Grid System:**
- **Desktop:** 12-column fluid grid, 1280px max-width, 24px gutters.
- **Tablet:** 8-column grid, 16px gutters.
- **Mobile:** 4-column grid, 16px gutters.

**Spacing Logic:**
- Use **48px - 64px** for vertical section spacing to maintain the Scandinavian "openness."
- Use **12px - 16px** for internal component padding (e.g., inside cards or input fields).

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layering** supplemented by **Ambient Shadows**.

1.  **Level 0 (Background):** Pure Black (#09090B).
2.  **Level 1 (Cards/Surfaces):** Dark Charcoal (#1A1A1B).
3.  **Level 2 (Modals/Popovers):** Slate Charcoal (#27272A) with a soft, diffused shadow (Blur: 32px, Y: 16px, Opacity: 40% Black).

**Interactive Depth:**
When an element is hovered, use a subtle **Inner Glow** (1px stroke) using the Primary color at 20% opacity rather than traditional "lift" shadows. This reinforces the IT/Electronic hardware feel.

## Shapes
The shape language balances modern softness with technical rigidity. 

- **Components:** Standard buttons, inputs, and cards use a **12px (0.75rem)** radius.
- **Large Containers:** Hero sections or main content blocks use a **16px (1rem)** radius.
- **Micro-elements:** Checkboxes and small tags use a **4px** radius to maintain a crisp look.

The use of `rounded-lg` (16px) is preferred for card elements to create the "friendly yet professional" Scandinavian silhouette.

## Components

### Buttons
- **Primary:** Electric Yellow background, Black text (#09090B), Bold weight. No border.
- **Secondary:** Ghost style. Transparent background, 1px White border (30% opacity), White text.
- **Hover States:** Primary buttons should "glow" on hover—add a drop shadow with the primary color at 30% opacity.

### Input Fields
- **Style:** Deep charcoal background (#1A1A1B), 1px border (#3F3F46).
- **Focus State:** Border changes to Electric Yellow, 1px thickness.
- **Labels:** Positioned above the field in `label-sm` style.

### Cards
- **Construction:** Background #1A1A1B, 12px corner radius, 1px subtle border (#27272A).
- **Content:** Headline in White, Description in Muted Grey.

### Chips / Status Indicators
- **Style:** Small, pill-shaped with 10% opacity of the status color (e.g., Green for "Active", Yellow for "In Progress") and 100% opacity text.

### Interactive Lists
- Use for technical specifications. Each item separated by a 1px divider (#27272A). Left-aligned icons in Electric Yellow to guide the eye.