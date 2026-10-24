---
name: jig
description: The jig.awdlab.dev docs and showcase site, built from @awdlab/jig on the nova theme.
colors:
  ink: '#4557ba'
  ink-600: '#374695'
  ink-700: '#293470'
  ink-400: '#6a79c8'
  ink-100: '#daddf1'
  ink-50: '#eceef8'
  slate-background: '#f7f8fa'
  slate-50: '#f0f2f5'
  slate-100: '#e1e5ea'
  slate-200: '#c2cad6'
  slate-300: '#a4b0c1'
  slate-500: '#677b98'
  slate-600: '#52637a'
  slate-800: '#29313d'
  slate-text: '#0a0c0f'
  mustard: '#ffc300'
  bubblegum: '#ff0077'
  crimson-flame: '#ed1612'
  solar-marigold: '#ff9500'
  electric-sky: '#0da6f2'
  forest-verdant: '#2ad52a'
  angular-pink: '#e90464'
  angular-magenta: '#f736e3'
  angular-purple: '#8514f5'
  angular-indigo: '#5c44e4'
typography:
  display:
    fontFamily: 'Inter Variable, Inter, system-ui, sans-serif'
    fontSize: 'clamp(2.75rem, 8vw, 6.5rem)'
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: '-0.025em'
  headline:
    fontFamily: 'Inter Variable, Inter, system-ui, sans-serif'
    fontSize: '2.75rem'
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: 'Inter Variable, Inter, system-ui, sans-serif'
    fontSize: '1.875rem'
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: 'Inter Variable, Inter, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: 'Consolas, Menlo, Monaco, Lucida Console, Courier New, monospace'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: '0.05em'
rounded:
  sm: '0.5rem'
  md: '0.75rem'
  lg: '0.875rem'
  xl: '1rem'
  full: '9999px'
spacing:
  sm: '0.25rem'
  md: '0.5rem'
  lg: '0.75rem'
  xl: '1rem'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.slate-background}'
    rounded: '{rounded.md}'
    padding: '0 0.75rem'
    height: '2.125rem'
  button-primary-hover:
    backgroundColor: '{colors.ink-600}'
  button-primary-active:
    backgroundColor: '{colors.ink-700}'
  button-secondary:
    backgroundColor: '{colors.slate-50}'
    textColor: '{colors.slate-text}'
    rounded: '{rounded.md}'
    padding: '0 0.75rem'
    height: '2.125rem'
  button-secondary-hover:
    textColor: '{colors.ink-600}'
  input-field:
    backgroundColor: '{colors.slate-50}'
    textColor: '{colors.slate-text}'
    rounded: '{rounded.md}'
    padding: '0.25rem 0.75rem'
    height: '2.125rem'
  tag:
    backgroundColor: '{colors.ink-100}'
    textColor: '{colors.ink-600}'
    rounded: '{rounded.md}'
    padding: '0.25rem 0.5rem'
  card:
    backgroundColor: '{colors.slate-background}'
    rounded: '{rounded.lg}'
  eyebrow:
    textColor: '{colors.ink-600}'
    typography: '{typography.label}'
---

# Design System: jig

## Overview

**Creative North Star: "The Living Specimen"**

Every surface on jig.awdlab.dev is the product under glass. The hero, the CRM dashboard demo, the keyboard theater and the docs playgrounds all render real `@awdlab/jig` controls on the real nova theme, so the site never shows a picture of the library when it can show the library itself. Labels read like specimen tags: small, monospace, uppercase, in ink. The chrome around the specimens stays quiet and cool so the controls carry the show.

The name comes from the workbench. A jig is the guide that makes a cut repeatable, and the site keeps that precision: one shared control height, one radius scale, one ring recipe, tokens everywhere. It also hands the user the tools. The topbar's theme picker swaps preset, primary color and scheme at runtime, and the whole site follows. Showing off that customizability here and there is on-brand, as long as each moment proves a real capability.

Density is moderate. Marketing sections breathe inside a 1100px column; docs pages run a compact sidebar, a wide reading column and an on-this-page rail. Light and dark are equal citizens: nova mirrors its palettes in dark mode, so every rule here holds in both schemes.

**Key Characteristics:**

- Real controls as illustration; no mock screenshots of the library on the site itself.
- Cool slate chrome, ink-blue voice, one gradient spark in the hero.
- Monospace uppercase eyebrows and stat labels as specimen tags.
- Everything token-driven, so the theme picker can re-skin the whole site.
- Motion that settles (expo-out reveals), always reduced under `prefers-reduced-motion`.

## Colors

A cool, low-chroma slate system with a single ink-blue voice; the semantic palette stays in the controls, and color beyond ink is rare and earned.

Every palette is generated from one base hue by `hsl(from <base> h s L)` with lightness `(1000 − level) / 10`, so `500` is the base at 50% lightness. Dark mode reverses each ramp. Hex values here are the light-scheme renderings.

### Primary

- **Ink** (500): the one voice. Primary buttons, active nav, focus rings, keycap presses. `600` is ink text (eyebrows, links, labels) and hover; `700` is pressed; `400` tints the glow-card wash and blockquote rule; `50`/`100` back tonal fills such as tags and pressed keycaps.

### Secondary

- **Mustard** (500): nova's secondary kind. Available to controls; the site chrome barely touches it.

### Tertiary

- **Bubblegum** (500, base `#ff248a`): nova's accent kind. Used sparingly on the site, mostly as a pale `200` highlight.
- **The Angular gradient** (Angular Pink → Angular Magenta → Angular Purple → Angular Indigo): a brand-only blend clipped to the hero's highlighted word and the hero divider. It drifts on a 12s linear loop and holds still under reduced motion.

### Semantic

- **Crimson Flame** (error, invalid fields), **Solar Marigold** (warning), **Electric Sky** (info), **Forest Verdant** (success). Kinds for controls, not decoration.

### Neutral

- **Slate background** (25): page background and card fill.
- **Slate 50**: raised fields, secondary buttons, sidebar card, blockquote fill.
- **Slate 100 / 200**: hairline borders (`100` light, `200` dark), dividers, card and playground borders, playground dot grid.
- **Slate 600**: muted text: section subtitles, sidebar group labels, stat labels, placeholders.
- **Slate 500**: non-text only (list markers, dividers); as text it fails AA on the background.
- **Slate 800**: topbar icon color.
- **Slate text** (950): body and heading text.

### Named Rules

**The Follows-the-Picker Rule.** Site chrome uses only `--jig-*` tokens, so the theme picker re-skins it. Hard-coded color is reserved for the Angular gradient, the logo and deliberate demo themes.

**The Slate Carries, Ink Speaks Rule.** Neutrals do the structural work (surface tokens outnumber primary roughly 2.5 to 1 in the site code); ink marks what is interactive or important. Accent and secondary appear only when a control's kind calls for them.

**The One Spark Rule.** The Angular gradient lives in the hero only. It is never a button fill, a background wash or a card border.

**The 600-For-Text Rule.** Text takes step `600` of slate and ink and step `700` of the semantic kinds, never `500` or below. nova mirrors its ramps in dark mode, so those steps pass AA in both schemes; text on a filled shade uses its `-contrast` token.

## Typography

**Display Font:** Inter Variable (with Inter, system-ui)
**Body Font:** Inter Variable (with Inter, system-ui)
**Label/Mono Font:** Consolas (with Menlo, Monaco, Lucida Console, Courier New)

**Character:** One sans family for everything spoken, one system monospace for everything labelled: code, eyebrows, versions, stats, keycaps. Hierarchy comes from weight and size, never from a second display face.

### Hierarchy

- **Display** (700, `clamp(2.75rem, 8vw, 6.5rem)`, line-height 0.9, −0.025em, balanced): the rotating hero headline only.
- **Headline** (700, 2.25rem → 2.75rem at `lg`, leading-tight): start-page section headings.
- **Title** (600, 1.875rem / 30px): docs h2; docs headings step down 4xl → lg at 600.
- **Body** (400, 1rem, line-height 1.7 in markdown): docs prose and section subtitles, capped at 70ch.
- **Label** (400, 0.875rem mono, uppercase, wider tracking): eyebrows in ink, stat and version tags in slate; the topbar "by awdlab" tag goes down to 0.66rem with 0.14em tracking.

nova's control scale is `xs` 0.75rem, `sm` 0.875rem, `md` 1rem, `lg` 1.125rem, `xl` 1.25rem, `2xl` 1.5rem; controls label at semibold (600).

### Named Rules

**The Specimen Tag Rule.** Anything that names, counts or versions something is mono and uppercase; anything that argues or explains is Inter.

## Layout

- **Start page:** stacked sections in a centered `max-width: 1100px` column, `1rem` side gutter, `3rem` vertical padding (`4rem` at `lg`). Every section opens with the same header (eyebrow, heading, subtitle), then either a full-width stage or a two-column split that collapses to one column below `lg`.
- **Docs:** sticky translucent topbar (4rem tall, background at 72% over a `backdrop-blur-md`), a floating 16rem sidebar card on the left, a reading column (~786px at 1440 wide) and an "On this page" rail on the right.
- **Navigation breakpoint:** 901px (`--breakpoint-nav`). At or above it the sidebar and topbar breadcrumb show; below it a hamburger and an in-content breadcrumb take over.
- **Rhythm:** nova's padding scale (`sm` 0.25rem, `md` 0.5rem, `lg` 0.75rem, `xl` 1rem) sets control internals and section gaps; page-level spacing uses Tailwind steps on top.
- **Shared control height:** 2.125rem (34px) for buttons, fields and table cells, so mixed rows line up.
- The document is the single scroll container (`scrollbar-gutter: stable`, smooth anchor scrolling).

## Elevation & Depth

A hybrid: surfaces are tonal and bordered at rest, and soft slate-tinted shadows mark what floats or responds. Light shadows are tinted with `rgba(30, 36, 54, …)`; dark shadows switch to near-opaque black because tint vanishes on dark surfaces. Modals push the page back with a light black scrim plus blur and desaturation.

### Shadow Vocabulary

- **sm** (`0 1px 2px rgba(30,36,54,.06)`): resting primary button.
- **md** (`0 4px 12px -2px rgba(30,36,54,.14)`): hover state, sidebar card, glow-card lift.
- **lg** (`0 12px 32px -8px rgba(30,36,54,.22)`): popovers and menus.
- **xl** (`0 20px 48px -12px rgba(30,36,54,.28)`): dialogs and drawers.

### Named Rules

**The Lift-On-Intent Rule.** Shadows grow in response to the pointer (primary button sm → md, glow card + `translateY(-3px)`), never at rest for decoration.

**The Translucent Ring Rule.** Focus is a 3px ring of the kind's `500` mixed into transparent (`20%` light / `32%` dark), never a solid band; small boxes (checkbox, switch) use the stronger `30%` / `42%` mix.

## Shapes

Soft, consistent corners from one scale: `sm` 0.5rem for inline code and blockquotes, `md` 0.75rem for buttons, fields, tags and keycaps, `lg` 0.875rem for cards and playgrounds, `xl` 1rem for large panels, `full` for avatars and pills. Borders are 1px hairlines in slate 100–200. Keycaps are the one exception to flat borders: a 3px bottom edge that collapses to 1px when pressed.

## Components

### Buttons

Precise and quietly tactile.

- **Shape:** gently rounded (0.75rem), 34px tall, semibold label.
- **Primary:** ink fill, auto-contrast text, resting `shadow.sm`.
- **Hover / Focus:** hover darkens to ink 600 and lifts to `shadow.md`; pressed drops to ink 700 and `shadow.sm`. Focus-visible draws the translucent 3px ring.
- **Secondary:** slate-50 fill with a hairline border; hover borders in ink and turns the label ink 600.
- **Text / Link / Icon:** text buttons tint 10% ink on hover; links underline at 3px offset; icon buttons are 34px squares on slate 100.
- Color crossfades only on secondary and link kinds; on filled kinds a text crossfade would pass through a muddy midpoint.

### Tags

- **Style:** tonal: the kind's `100` background with its auto-contrast `600-on-100` text, 0.75rem corners, extra-small semibold label.

### Cards / Containers

- **Corner Style:** 0.875rem.
- **Background:** slate 25 (`.card`).
- **Shadow Strategy:** none at rest; glow cards lift on hover (see Elevation).
- **Border:** 1px slate 200.
- **Playground:** the same border on a 24px slate dot grid, the stage for live demos.

### Inputs / Fields

- **Style:** slate-50 fill, 1px slate border, 0.75rem corners, 34px minimum height (grows for textareas and chips); labels float when focused or filled.
- **Focus:** border turns ink 500 and a 3px translucent ink outline fades in (0.15s).
- **Error / Disabled / Read-only:** invalid keeps a crimson border and a crimson ring; disabled flattens to the disabled tokens with no ring; read-only gets a neutral ring.

### Navigation

- **Topbar:** translucent and blurred over the page, logo plus mono "by awdlab" tag, slate-800 icon actions (search, theme picker, scheme toggle, GitHub).
- **Sidebar:** a floating slate-50 card with `shadow.md`; a Guides / Components switch with the active side as an ink pill; uppercase extra-small slate-600 group labels; the current page gets a tonal slate highlight.
- **Mobile:** below 901px a hamburger replaces the sidebar.

### Glow Card (signature)

A bento tile whose radial ink wash (`primary-400` at 16%) follows the pointer; on hover it lifts 3px, picks up `shadow.md` and mixes its border 45% toward ink. The lift is disabled under reduced motion.

### Keycap (signature)

The keyboard theater's key: mono semibold label, slate-300 border with a 3px bottom edge, which presses down to 1px, turns ink and glows. A matching simulated focus ring (2px ink outline, 3px offset, soft ink glow) hops between targets.

## Do's and Don'ts

### Do:

- **Do** illustrate with live `@awdlab/jig` controls on the active theme instead of static mockups.
- **Do** color site chrome through `--jig-color-*`, `--jig-size-*` and `--jig-shadow-*` tokens so the theme picker re-skins it.
- **Do** open every start-page section with the shared header: mono ink eyebrow, bold heading, slate-600 subtitle capped at 70ch.
- **Do** keep single-line controls at the shared 34px height and on the 0.5 / 0.75 / 0.875rem radius steps.
- **Do** use expo-out reveals (`cubic-bezier(0.16, 1, 0.3, 1)`, 24px rise, 0.7s) and collapse all motion under `prefers-reduced-motion`.
- **Do** check every new surface in both light and dark.

### Don't:

- **Don't** spread the Angular gradient beyond the hero highlight and hero divider.
- **Don't** hard-code hex for chrome; it breaks the theme picker.
- **Don't** draw focus as a solid outline band; use the translucent ring recipe.
- **Don't** add resting shadows to cards; depth answers intent.
- **Don't** introduce a second display typeface; hierarchy comes from Inter's weights and the mono labels.
