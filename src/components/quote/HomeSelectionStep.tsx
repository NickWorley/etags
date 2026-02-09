'use client';

import { useState, useMemo } from 'react';
import { useQuoteStore } from '@/store/quote-store';
import {
  HOME_PACKAGE_LABELS,
  HOME_PACKAGE_DESCRIPTIONS,
  HOME_SIZE_LABELS,
  HOME_ADDON_PRICING,
  formatCurrency,
} from '@/lib/constants';
import type { HomeCoverageType, HomeSize, CoverageDuration, HomeAddOn } from '@/lib/types';
import homeCoveragesJson from '@/lib/home-coverages.json';
import { ArrowLeft, Home, Check } from 'lucide-react';

// Build a typed lookup from the JSON
const homePrices: Record<
  string,
  {
    coverageRate: string;
    term: string;
    admin: string;
    reserve: string;
    commision: string;
    total: string;
    suggestedRetail: string;
  }
> = homeCoveragesJson as unknown as Record<string, { coverageRate: string; term: string; admin: string; reserve: string; commision: string; total: string; suggestedRetail: string }>;

const PACKAGE_TYPES: { key: HomeCoverageType; code: string }[] = [
  { key: 'appliance', code: 'APL' },
  { key: 'system', code: 'SYS' },
  { key: 'total', code: 'TTL' },
];

const DURATIONS: CoverageDuration[] = [1, 2, 3];

const SIZE_MAP: Record<HomeSize, string> = {
  'less-than-5': '5K',
  'between-5-and-8': '8K',
  'more-than-8': '12K',
  condo: 'CND',
};

function buildCoverageCode(typeCode: string, duration: CoverageDuration, sizeCode: string): string {
  return `BEE${typeCode}B${duration}Y${sizeCode}100D`;
}

export default function HomeSelectionStep() {
  const { setHomeCoverage, setStep } = useQuoteStore();

  const [selectedType, setSelectedType] = useState<HomeCoverageType>('total');
  const [duration, setDuration] = useState<CoverageDuration>(1);
  const [homeSize, setHomeSize] = useState<HomeSize>('less-than-5');
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

  // Build the coverage code
  const typeCode = PACKAGE_TYPES.find((p) => p.key === selectedType)!.code;
  const sizeCode = SIZE_MAP[homeSize];
  const coverageCode = buildCoverageCode(typeCode, duration, sizeCode);

  // Look up the price
  const priceData = homePrices[coverageCode] ?? null;

  // Get add-on pricing for current duration
  const addOnPricing = HOME_ADDON_PRICING[duration] ?? {};

  // Calculate total
  const baseRetail = priceData ? parseFloat(priceData.suggestedRetail) : 0;
  const addOnTotal = useMemo(() => {
    let total = 0;
    for (const key of selectedAddOns) {
      if (addOnPricing[key]) {
        total += addOnPricing[key].price;
      }
    }
    return total;
  }, [selectedAddOns, addOnPricing]);
  const grandTotal = baseRetail + addOnTotal;

  function toggleAddOn(key: string) {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleSave() {
    if (!priceData) return;

    // Build add-on list
    const addOns: HomeAddOn[] = [];
    for (const key of selectedAddOns) {
      const addon = addOnPricing[key];
      if (addon) {
        // Build the add-on loss code: prefix + duration + suffix
        const addOnLossCode = `${addon.lossCodePrefix}${duration}${addon.lossCodeSuffix}`;
        addOns.push({
          code: addOnLossCode,
          name: addon.name,
          price: addon.price,
        });
      }
    }

    setHomeCoverage({
      coverageCode,
      coverageTitle: HOME_PACKAGE_LABELS[selectedType] ?? selectedType,
      coverageType: selectedType,
      duration,
      homeSize,
      homeSizeLabel: HOME_SIZE_LABELS[homeSize] ?? homeSize,
      priceBreakdown: {
        term: priceData.term,
        admin: priceData.admin,
        reserve: priceData.reserve,
        commision: priceData.commision,
        total: priceData.total,
        suggestedRetail: priceData.suggestedRetail,
        coverageRate: priceData.coverageRate,
      },
      addOns,
      addOnPrice: addOnTotal,
      totalFinalPrice: grandTotal,
    });

    setStep('bundle-prompt');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep('bundle-prompt')}
          className="flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-accent transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold font-display text-navy-900">Home Protection Plans</h2>
        </div>
      </div>

      {/* Package Selection Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {PACKAGE_TYPES.map(({ key }) => {
          const isSelected = selectedType === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`rounded-2xl p-5 text-left transition-all ${
                isSelected
                  ? 'border-2 border-accent bg-white shadow-lg ring-1 ring-accent/10'
                  : 'border border-navy-100 bg-navy-50 shadow-sm hover:shadow-md hover:border-navy-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-navy-900">
                  {HOME_PACKAGE_LABELS[key]}
                </h3>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-navy-500 leading-relaxed">
                {HOME_PACKAGE_DESCRIPTIONS?.[key] ?? ''}
              </p>
            </button>
          );
        })}
      </div>

      {/* Duration Selector */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wide mb-3">
          Coverage Duration
        </h3>
        <div className="flex gap-3">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`flex-1 rounded-lg border-2 py-3 text-sm font-semibold transition ${
                duration === d
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-navy-100 bg-navy-50 text-navy-600 hover:border-navy-100'
              }`}
            >
              {d} Year{d > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Home Size Selector */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wide mb-3">
          Home Size
        </h3>
        <select
          value={homeSize}
          onChange={(e) => setHomeSize(e.target.value as HomeSize)}
          className="w-full rounded-lg border border-navy-100 bg-navy-50 px-4 py-3 text-sm text-navy-700 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
        >
          {Object.entries(HOME_SIZE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Display */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wide mb-3">
          Base Price
        </h3>
        {priceData ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-navy-600">Coverage Rate</span>
              <span className="font-medium text-navy-900">
                {formatCurrency(baseRetail)}
              </span>
            </div>
            <p className="text-xs text-navy-500">{priceData.coverageRate}</p>
          </div>
        ) : (
          <p className="text-sm text-red-500">
            No pricing available for this combination. Please select a different configuration.
          </p>
        )}
      </div>

      {/* Optional Add-Ons */}
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h3 className="text-sm font-semibold text-navy-500 uppercase tracking-wide mb-3">
          Optional Add-Ons
        </h3>
        <div className="space-y-2">
          {Object.entries(addOnPricing).map(([key, addon]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-lg border border-navy-100 p-3 cursor-pointer transition hover:bg-navy-50"
            >
              <input
                type="checkbox"
                checked={selectedAddOns.has(key)}
                onChange={() => toggleAddOn(key)}
                className="h-4 w-4 rounded border-navy-100 text-accent focus:ring-accent/20"
              />
              <span className="flex-1 text-sm text-navy-700">{addon.name}</span>
              <span className="text-sm font-medium text-navy-500">
                +{formatCurrency(addon.price)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Total & Save */}
      <div className="rounded-2xl bg-navy-950 p-6 shadow-lg">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-navy-100">
            <span>Base Coverage</span>
            <span>{formatCurrency(baseRetail)}</span>
          </div>
          {addOnTotal > 0 && (
            <div className="flex justify-between text-sm text-navy-100">
              <span>Add-Ons ({selectedAddOns.size})</span>
              <span>+{formatCurrency(addOnTotal)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-navy-700">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-extrabold text-white">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!priceData}
        className="w-full rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-navy-950 shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save &amp; Continue
      </button>
    </div>
  );
}
