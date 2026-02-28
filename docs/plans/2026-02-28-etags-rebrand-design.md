# eTags Rebrand & Reskin Design

**Date:** 2026-02-28
**Status:** Approved

## Goal

Transform the Click4Coverage codebase into an eTags-branded vehicle service contract site:
1. Remove all home coverage functionality
2. Rebrand from Click4Coverage to eTags
3. Reskin with eTags.com color scheme, fonts, and logo

## Phase 1: Strip Home Coverage

### Files to DELETE
- `src/app/home-coverage/page.tsx`
- `src/components/quote/HomeSelectionStep.tsx`
- `src/components/quote/HomeCoverageSummary.tsx`
- `src/lib/home-coverages.json`
- `src/app/api/contract/home/route.ts`

### Files to MODIFY (remove home references)
- `src/components/layout/Header.tsx` — remove "Home Coverage" nav link
- `src/components/layout/Footer.tsx` — remove "Home Coverage" from services links
- `src/app/page.tsx` — remove "Home Coverage" feature card from landing page
- `src/components/quote/QuoteWizard.tsx` — remove `initialProduct`, `HOME_STEPS`, home flow logic; always auto flow
- `src/components/quote/BundlePrompt.tsx` — remove "Add Home Coverage" option; simplify to just add vehicle or continue
- `src/components/quote/CartReview.tsx` — remove HomeCoverageSummary import, home discount logic, home-related rendering
- `src/components/quote/CheckoutStep.tsx` — remove home contract creation, home discount logic, HomeCoverageSummary
- `src/components/quote/SuccessPage.tsx` — remove home coverage display
- `src/store/quote-store.ts` — remove `homeCoverage`, `setHomeCoverage` state/actions
- `src/lib/types.ts` — remove `HomeCoverageType`, `HomeSize`, `CoverageDuration`, `HomePriceBreakdown`, `HomeAddOn`, `HomeCoverage` types; remove `home-selection` from `WizardStep`
- `src/lib/constants.ts` — remove `HOME_PACKAGE_LABELS`, `HOME_SIZE_LABELS`, `HOME_ADDON_PRICING`
- `src/app/quote/page.tsx` — remove `?product=home` parsing, `initialProduct` prop
- `src/components/quote/VehicleInfoStep.tsx` — remove `startedWithHome` prop

### Bundle Discount
- Keep 10% discount for 2 vehicles
- Remove home-related discount conditions

## Phase 2: Rebrand to eTags

### Text Replacements (all files)
| Find | Replace |
|------|---------|
| Click-4-Coverage | eTags |
| Click4Coverage | eTags |
| click4coverage | etags |
| click-for-coverage | etags |
| C4C | eTags |
| Click for Coverage | eTags |

### Metadata Updates
- `package.json` — name: "etags"
- `src/app/layout.tsx` — title, description metadata
- `src/app/terms/page.tsx` — all company name references, fix "conditiions" typo
- `src/app/cookies/page.tsx` — company name, replace `172.29.128.1:3000` with `etags.vercel.app`
- All page metadata descriptions

### Logo
- Download eTags favicon/icon from `https://www.etags.com/assets/img/favicons/logo200x200.png`
- Replace `public/images/c4c-logo.png`
- Update favicon

## Phase 3: Reskin to eTags Branding

### Color Theme (globals.css)

**Current → New:**
| Token | Current (Click4Coverage) | New (eTags) |
|-------|-------------------------|-------------|
| navy-950 | (dark navy) | `#01132c` |
| navy-900 | | `#0a1f3d` |
| navy-800 | | `#133b5d` |
| navy-700 | | `#1c567e` |
| navy-600 | | `#25729e` |
| navy-500 | | `#3094e8` |
| navy-100 | | `#d6eafa` |
| navy-50 | | `#eef5fc` |
| accent | `#d4a853` (gold) | `#3094e8` (blue) |
| accent-hover | `#c49742` | `#2676ba` |
| accent-light | `#e4c67a` | `#7bb5e6` |
| accent-muted | `rgba(212,168,83,0.12)` | `rgba(48,148,232,0.12)` |
| action | `#2563eb` | `#00ae47` (brand green) |
| action-hover | `#1d4ed8` | `#009a3e` |
| background | `#f7f8fa` | `#f8f8f9` |

### Hero Gradient
- Replace mesh gradient with: `linear-gradient(#144e91, #38abe6)`

### Fonts
- Replace DM Sans → Roboto (weights 300, 400, 500, 700)
- Replace DM Serif Display → Roboto Slab (variable 100-900)
- Update Google Fonts import in `layout.tsx`

### Button Styles
- Primary buttons: blue (`#3094e8`) with white text
- CTA buttons: optionally use yellow (`#fac142`) for high-visibility
- Border radius: keep existing rounded style (site already uses rounded-lg/xl/2xl)

### Landing Page Content
- Update hero text to focus on vehicle service contracts (no home mention)
- Keep the same layout structure (hero, quote form, features, trust signals, how it works)
- Update feature cards to be auto-only (4 auto-related features)

## Non-Goals
- We are NOT copying eTags.com's layout or page structure
- We are NOT selling title/registration services
- We keep our existing clean wizard-based quote flow
- We keep the existing Tailwind v4 architecture
