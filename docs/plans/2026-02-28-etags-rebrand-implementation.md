# eTags Rebrand Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Click4Coverage codebase into an eTags-branded auto-only vehicle service contract site.

**Architecture:** Three-phase surgical refactor: (1) strip home coverage code, (2) rebrand text/metadata, (3) reskin colors/fonts. Each phase is independently testable via `next build`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Zustand, TypeScript

---

## Phase 1: Strip Home Coverage

### Task 1: Delete home-only files

**Files:**
- Delete: `src/app/home-coverage/page.tsx`
- Delete: `src/components/quote/HomeSelectionStep.tsx`
- Delete: `src/components/quote/HomeCoverageSummary.tsx`
- Delete: `src/lib/home-coverages.json`
- Delete: `src/app/api/contract/home/route.ts`

**Step 1: Delete the files**

```bash
cd /c/Users/NicholasWorley/OneDrive\ -\ beecovered.com/Documents/Click4Coverage/etags
rm src/app/home-coverage/page.tsx
rm src/components/quote/HomeSelectionStep.tsx
rm src/components/quote/HomeCoverageSummary.tsx
rm src/lib/home-coverages.json
rm src/app/api/contract/home/route.ts
```

**Step 2: Commit**

```bash
git add -A && git commit -m "chore: delete home coverage files"
```

---

### Task 2: Remove home types from types.ts

**Files:**
- Modify: `src/lib/types.ts`

**Step 1: Remove home types and home-selection from WizardStep**

Remove the entire `// ─── Home Coverage ───` section (lines 84-117): `HomeCoverageType`, `HomeSize`, `CoverageDuration`, `HomePriceBreakdown`, `HomeAddOn`, `HomeCoverage`.

Remove `CreateHomeContractPayload` interface (lines 180-206).

Remove `home: HomeCoverage | null` from the `Cart` interface.

Remove `'home-selection'` and `'bundle-prompt'` from the `WizardStep` union type.

The `WizardStep` type should become:
```typescript
export type WizardStep =
  | 'vehicle-info'
  | 'plan-selection'
  | 'cart-review'
  | 'checkout'
  | 'success';
```

The `Cart` interface should become:
```typescript
export interface Cart {
  vehicles: VehicleCoverage[];
  masterPrice: number;
  paymentType: 'full' | 'buydown';
}
```

**Step 2: Commit**

```bash
git add src/lib/types.ts && git commit -m "chore: remove home coverage types"
```

---

### Task 3: Remove home constants from constants.ts

**Files:**
- Modify: `src/lib/constants.ts`

**Step 1: Remove home-related exports**

Delete `HOME_PACKAGE_LABELS`, `HOME_PACKAGE_DESCRIPTIONS`, `HOME_SIZE_LABELS`, and `HOME_ADDON_PRICING` (lines 27-88). Keep everything else.

**Step 2: Commit**

```bash
git add src/lib/constants.ts && git commit -m "chore: remove home constants"
```

---

### Task 4: Remove home from quote-store.ts

**Files:**
- Modify: `src/store/quote-store.ts`

**Step 1: Remove HomeCoverage import and state**

Remove `HomeCoverage` from the import statement.

Remove from `QuoteState` interface:
```
homeCoverage: HomeCoverage | null;
setHomeCoverage: (home: HomeCoverage) => void;
```

Remove from store implementation:
```
homeCoverage: null,
setHomeCoverage: (home) => set({ homeCoverage: home }),
```

Remove from `getMasterPrice`:
```
if (state.homeCoverage) total += state.homeCoverage.totalFinalPrice;
```

Remove from `reset`:
```
homeCoverage: null,
```

**Step 2: Commit**

```bash
git add src/store/quote-store.ts && git commit -m "chore: remove home coverage from store"
```

---

### Task 5: Simplify QuoteWizard.tsx (auto-only)

**Files:**
- Modify: `src/components/quote/QuoteWizard.tsx`

**Step 1: Remove all home flow logic**

- Remove `HomeSelectionStep` import
- Remove `HOME_STEPS` constant
- Remove `initialProduct` prop (and its interface field)
- Remove `isHomeFlow`, `useMemo` for STEPS, home redirect `useEffect`
- Remove `home-selection` step rendering
- Remove `bundle-prompt` step rendering
- Remove `startedWithHome` prop from `VehicleInfoStep`
- Simplify `getProgressIndex` to only handle auto steps
- Rename `AUTO_STEPS` to `STEPS`

The simplified component should only accept `initialVin` and `initialMileage` props. The steps are: Vehicle Info → Select Plan → Review → Checkout.

After plan selection, go directly to `cart-review` (no bundle prompt).

**Step 2: Commit**

```bash
git add src/components/quote/QuoteWizard.tsx && git commit -m "chore: simplify QuoteWizard to auto-only"
```

---

### Task 6: Simplify BundlePrompt.tsx (vehicles only)

**Files:**
- Modify: `src/components/quote/BundlePrompt.tsx`

**Step 1: Remove home option**

- Remove `Home` from lucide-react import
- Remove `homeCoverage` from store destructuring
- Remove `canAddHome` variable
- Remove entire "Add Home Coverage" button block (lines 58-75)

**Step 2: Commit**

```bash
git add src/components/quote/BundlePrompt.tsx && git commit -m "chore: remove home from BundlePrompt"
```

---

### Task 7: Simplify CartReview.tsx

**Files:**
- Modify: `src/components/quote/CartReview.tsx`

**Step 1: Remove home references**

- Remove `HomeCoverageSummary` import
- Remove `homeCoverage` from store destructuring
- Remove home from bundle discount condition — change to: `const bundleDiscount = coveredVehicles.length >= 2 ? BUNDLE_DISCOUNT_PERCENT : 0;`
- Remove commented-out code blocks
- Remove `{homeCoverage && <HomeCoverageSummary ... />}` rendering
- Remove `homeCoverage` from `canProceed` — change to: `const canProceed = coveredVehicles.length > 0;`
- Remove home branch in `handleReviewSub` (`else if (homeCoverage)`)
- Remove home from "Add More Coverage" visibility check — change to: `{coveredVehicles.length <= 1 && (...)}`

**Step 2: Commit**

```bash
git add src/components/quote/CartReview.tsx && git commit -m "chore: remove home from CartReview"
```

---

### Task 8: Simplify CheckoutStep.tsx

**Files:**
- Modify: `src/components/quote/CheckoutStep.tsx`

**Step 1: Remove home references**

- Remove `HomeCoverageSummary` import
- Remove `homeCoverage` from store destructuring
- Remove home from bundle discount condition — same as CartReview
- Remove `homeCoverage` from buydown reserve calculation — remove `+ (Number(homeCoverage?.priceBreakdown.reserve) || 0)`
- Remove home contract creation block (the `if (homeCoverage) { ... }` section)
- Remove `homeSuccess` variable and its checks
- Remove `homeDetails` from capture request body
- Remove `homeContractResult` variable
- Remove `{homeCoverage && <HomeCoverageSummary ... />}` rendering in coverage summary
- Remove commented-out code blocks

**Step 2: Commit**

```bash
git add src/components/quote/CheckoutStep.tsx && git commit -m "chore: remove home from CheckoutStep"
```

---

### Task 9: Simplify SuccessPage.tsx

**Files:**
- Modify: `src/components/quote/SuccessPage.tsx`

**Step 1: Remove home references**

- Remove `homeCoverage` from store destructuring
- Remove entire `{homeCoverage && (...)}` block (lines 63-78)
- Change `Home` icon import to just keep `Printer` — actually `Home` is used for "Return Home" button, so keep it

**Step 2: Commit**

```bash
git add src/components/quote/SuccessPage.tsx && git commit -m "chore: remove home from SuccessPage"
```

---

### Task 10: Simplify VehicleInfoStep.tsx and quote/page.tsx

**Files:**
- Modify: `src/components/quote/VehicleInfoStep.tsx`
- Modify: `src/app/quote/page.tsx`

**Step 1: Remove startedWithHome prop from VehicleInfoStep**

Remove `startedWithHome` from the interface and default param. Remove it from the back button condition — change to: `{currentVehicleIndex > 0 && (...)}`

**Step 2: Remove product param from quote/page.tsx**

Remove `product` and `productType` variables. Remove `initialProduct` prop from `<QuoteWizard>`.

**Step 3: Commit**

```bash
git add src/components/quote/VehicleInfoStep.tsx src/app/quote/page.tsx && git commit -m "chore: remove home flow from VehicleInfo and quote page"
```

---

### Task 11: Remove home from landing page and nav

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Update landing page**

- Remove `Home` from lucide-react import
- Remove the "Home Coverage" feature card (lines 80-90)
- Change grid to `lg:grid-cols-3` (3 cards now)
- Update "Safeguard Your Investment" paragraph to remove "your home and" references — focus on vehicle only
- Replace the 4th card with a new auto-relevant card, e.g. "Nationwide Network" with a `MapPin` icon

**Step 2: Remove Home Coverage from Header nav**

Remove `{ label: 'Home Coverage', href: '/home-coverage' }` from `navLinks` array.

**Step 3: Remove Home Coverage from Footer**

Remove the `<li>` containing the Home Coverage link from the "Explore Our Services" column.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/components/layout/Header.tsx src/components/layout/Footer.tsx && git commit -m "chore: remove home from landing page and navigation"
```

---

### Task 12: Build verification (Phase 1)

**Step 1: Run build**

```bash
npx next build
```

Expected: Build succeeds with no errors. Fix any remaining import or reference issues.

**Step 2: Commit any fixes**

```bash
git add -A && git commit -m "fix: resolve build errors after home removal"
```

---

## Phase 2: Rebrand to eTags

### Task 13: Update package.json and root layout metadata

**Files:**
- Modify: `package.json`
- Modify: `src/app/layout.tsx`

**Step 1: Update package.json name**

Change `"name": "click-for-coverage"` to `"name": "etags"`.

**Step 2: Update layout.tsx metadata**

```typescript
export const metadata: Metadata = {
  title: 'eTags | Vehicle Service Contracts',
  description:
    'Protect your investment with trusted Vehicle Service Contracts from eTags. Get a quote in seconds. Nationwide coverage, ASE Certified mechanics, $0 deductible options available.',
  keywords: 'vehicle service contract, auto coverage, mechanical breakdown coverage, protection plan, etags',
};
```

**Step 3: Commit**

```bash
git add package.json src/app/layout.tsx && git commit -m "chore: rebrand metadata to eTags"
```

---

### Task 14: Download eTags logo and favicon

**Files:**
- Replace: `public/images/c4c-logo.png`
- Add: `public/images/etags-logo.png`
- Replace: `src/app/favicon.ico`

**Step 1: Download eTags assets**

```bash
curl -L -o public/images/etags-logo.png "https://www.etags.com/assets/img/favicons/logo200x200.png"
curl -L -o src/app/favicon.ico "https://www.etags.com/assets/img/favicons/favicon.ico"
rm public/images/c4c-logo.png
```

**Step 2: Update Header.tsx and Footer.tsx logo references**

In `Header.tsx`: Change `src="/images/c4c-logo.png"` to `src="/images/etags-logo.png"` and `alt="Click4Coverage"` to `alt="eTags"`.

In `Footer.tsx`: Same changes.

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: replace logo and favicon with eTags assets"
```

---

### Task 15: Rebrand text across all pages

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/quote/SuccessPage.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/auto-coverage/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/contact/layout.tsx`
- Modify: `src/app/faq/page.tsx`
- Modify: `src/app/faq/layout.tsx`
- Modify: `src/app/terms/page.tsx`
- Modify: `src/app/cookies/page.tsx`
- Modify: `src/app/api/contract/add-note/route.ts`
- Modify: `src/app/api/payment/capture/route.tsx`
- Modify: `src/components/landing/HeroSection.tsx`
- Modify: `src/components/landing/TrustSignals.tsx`
- Modify: `src/components/landing/HowItWorks.tsx`

**Step 1: Global find/replace**

Apply these replacements across ALL files in `src/`:

| Find | Replace |
|------|---------|
| `Click-4-Coverage` | `eTags` |
| `Click4Coverage` | `eTags` |
| `click4coverage` | `etags` |
| `Click for Coverage` | `eTags` |
| `click-for-coverage` | `etags` |

Also fix specific issues:
- `cookies/page.tsx`: Replace `http://172.29.128.1:3000` with `https://etags.vercel.app`
- `terms/page.tsx`: Fix typo `conditiions` → `conditions`
- `payment/capture/route.tsx`: Fix `payed` → `paid`
- `payment/cancel/route.ts`: Fix `contract support` → `contact support`
- `api/contract/add-note/route.ts`: Change "Click4Coverage website" to "eTags website"
- `api/payment/capture/route.tsx`: Change "Click-4-Coverage website" to "eTags website"

**Step 2: Commit**

```bash
git add -A && git commit -m "chore: rebrand all text from Click4Coverage to eTags"
```

---

### Task 16: Build verification (Phase 2)

**Step 1: Run build**

```bash
npx next build
```

Expected: Build succeeds with no errors.

**Step 2: Commit any fixes**

```bash
git add -A && git commit -m "fix: resolve build errors after rebrand"
```

---

## Phase 3: Reskin to eTags Branding

### Task 17: Update color theme in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Replace the @theme inline block**

```css
@theme inline {
  --color-background: #f8f8f9;
  --color-foreground: #01132c;
  --color-navy-950: #01132c;
  --color-navy-900: #0a1f3d;
  --color-navy-800: #133b5d;
  --color-navy-700: #1c567e;
  --color-navy-600: #25729e;
  --color-navy-500: #3094e8;
  --color-navy-100: #d6eafa;
  --color-navy-50: #eef5fc;
  --color-accent: #3094e8;
  --color-accent-hover: #2676ba;
  --color-accent-light: #7bb5e6;
  --color-accent-muted: rgba(48, 148, 232, 0.12);
  --color-action: #00ae47;
  --color-action-hover: #009a3e;
  --color-action-light: #44b743;
  --color-success: #10b981;
  --color-success-light: #34d399;
  --color-glass: rgba(255, 255, 255, 0.06);
  --color-glass-border: rgba(255, 255, 255, 0.1);
  --color-glass-strong: rgba(255, 255, 255, 0.12);
  --font-sans: var(--font-roboto);
  --font-display: var(--font-roboto-slab);
}
```

**Step 2: Update hero-mesh gradient**

Replace the `.hero-mesh` background with:

```css
.hero-mesh {
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(48, 148, 232, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 80% 20%, rgba(0, 174, 71, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 40% 80% at 60% 90%, rgba(48, 148, 232, 0.06) 0%, transparent 50%),
    linear-gradient(165deg, #01132c 0%, #0a1f3d 30%, #133b5d 70%, #1c567e 100%);
}
```

**Step 3: Update shimmer-line gradient**

Replace `rgba(212, 168, 83, 0.15)` with `rgba(48, 148, 232, 0.15)`.

**Step 4: Update scrollbar colors**

```css
::-webkit-scrollbar-track { background: #01132c; }
::-webkit-scrollbar-thumb { background: #25729e; }
::-webkit-scrollbar-thumb:hover { background: #3094e8; }
```

**Step 5: Update selection color**

```css
::selection { background-color: var(--color-accent); color: #ffffff; }
```

**Step 6: Commit**

```bash
git add src/app/globals.css && git commit -m "feat: reskin color theme to eTags branding"
```

---

### Task 18: Update fonts in layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Replace font imports**

```typescript
import { Roboto, Roboto_Slab } from 'next/font/google';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

const robotoSlab = Roboto_Slab({
  variable: '--font-roboto-slab',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
```

Update the html tag:
```tsx
<html lang="en" className={`${roboto.variable} ${robotoSlab.variable}`}>
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx && git commit -m "feat: switch fonts to Roboto and Roboto Slab"
```

---

### Task 19: Update button text colors for blue accent

**Files:**
- Modify: Multiple component files

**Step 1: Update button text color**

Since the accent color changed from gold (#d4a853, which needs dark text) to blue (#3094e8, which needs white text), update all buttons that use `text-navy-950` with accent background to use `text-white` instead.

Files to update:
- `src/components/layout/Header.tsx` — "Get Quote" button
- `src/components/landing/HeroSection.tsx` — "Get Your Free Quote" button
- `src/app/page.tsx` — "Secure Your Coverage" and "Start Your Quote" buttons
- `src/components/quote/BundlePrompt.tsx` — "Continue to Review" button
- `src/components/quote/CartReview.tsx` — "Proceed to Checkout" button
- `src/components/quote/CheckoutStep.tsx` — Pay button
- `src/components/quote/SuccessPage.tsx` — "Return Home" button
- `src/components/quote/PlanCard.tsx` — isRecommended button style
- `src/app/auto-coverage/page.tsx` — CTA buttons

Search for `text-navy-950` in these files and replace with `text-white` where the button has `bg-accent`.

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: update button text to white for blue accent"
```

---

### Task 20: Final build verification

**Step 1: Run build**

```bash
npx next build
```

Expected: Build succeeds with zero errors.

**Step 2: Run lint**

```bash
npx eslint src/
```

Note any remaining issues.

**Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix: final cleanup after reskin"
```

---

### Task 21: Deploy and verify

**Step 1: Push to GitHub**

```bash
git push origin main
```

**Step 2: Verify Vercel deployment**

```bash
vercel deployments --limit 1
```

Wait for deployment to complete, then check https://etags.vercel.app

---
