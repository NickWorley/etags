'use client';

import { useState, useMemo } from 'react';
import { useQuoteStore } from '@/store/quote-store';
import { TIER_ORDER, TIER_DESCRIPTIONS, formatCurrency } from '@/lib/constants';
import type { CoverageRate, CoverageTerm, LossCode } from '@/lib/types';
import PlanCard from './PlanCard';
import { ArrowLeft, Info } from 'lucide-react';

function getTierLevel(description: string): 1 | 2 | 3 | 4 {
  const lower = description.toLowerCase();
  if (lower.includes('exclusive')) return 4;
  if (lower.includes('premium')) return 3;
  if (lower.includes('essential plus')) return 2;
  return 1;
}

function getTierName(description: string): string {
  for (const tier of [...TIER_ORDER].reverse()) {
    if (description.toLowerCase().includes(tier.toLowerCase())) return tier;
  }
  return description;
}

function getDefaultTermIndex(terms: CoverageTerm[]): number {
  const preferred = terms.findIndex(
    (t) => t.termMonths === 36 && t.termOdometer === 45000
  );
  return preferred >= 0 ? preferred : 0;
}

function getFeatures(tierName: string): string[] {
  switch (tierName) {
    case 'Essential':
      return [
        'Engine Coverage',
        'Transmission / Transaxle',
        'Transfer Case / AWD',
      ];
    case 'Essential Plus':
      return [
        'Everything in Essential',
        'CV Joints & Water Pump',
        'Fuel System & Oil Pump',
        'Electrical Components',
        'Factory Turbo / Supercharger',
        'A/C Compressor',
        'Seals & Gaskets',
      ];
    case 'Premium':
      return [
        'Everything in Essential Plus',
        'Cooling System',
        'Brake System',
        'Steering Components',
        'Fluids & Lubricants',
      ];
    case 'Exclusive':
      return [
        'All Components Covered',
        'Exclusion-Based (Most Comprehensive)',
        'High-Tech Electronics',
        'Navigation & Infotainment',
        'Advanced Driver Assist Systems',
      ];
    default:
      return ['Coverage Included'];
  }
}

export default function PlanSelectionStep() {
  const { availableRates, currentVehicleIndex, vehicles, setVehicleCoverage, setStep } =
    useQuoteStore();

  // Per-tier state: selected term index and selected add-on loss codes
  const [selectedTermByTier, setSelectedTermByTier] = useState<Record<string, number>>({});
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, Set<number>>>({});
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  // Sort rates by TIER_ORDER
  const sortedRates = useMemo(() => {
    const rates = [...availableRates];
    rates.sort((a, b) => {
      const aIdx = TIER_ORDER.findIndex((t) =>
        a.description.toLowerCase().includes(t.toLowerCase())
      );
      const bIdx = TIER_ORDER.findIndex((t) =>
        b.description.toLowerCase().includes(t.toLowerCase())
      );
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
    return rates;
  }, [availableRates]);

  function getTermIndex(rate: CoverageRate): number {
    const tierName = getTierName(rate.description);
    if (selectedTermByTier[tierName] !== undefined) {
      return selectedTermByTier[tierName];
    }
    return getDefaultTermIndex(rate.terms);
  }

  function getAddOnSet(tierName: string): Set<number> {
    return selectedAddOns[tierName] ?? new Set();
  }

  function toggleAddOn(tierName: string, lossCodeId: number) {
    setSelectedAddOns((prev) => {
      const current = new Set(prev[tierName] ?? []);
      if (current.has(lossCodeId)) {
        current.delete(lossCodeId);
      } else {
        current.add(lossCodeId);
      }
      return { ...prev, [tierName]: current };
    });
  }

  function calculateTotal(term: CoverageTerm, addOnIds: Set<number>): {
    basePrice: number;
    surchargeCost: number;
    optionsCost: number;
    totalPrice: number;
  } {
    const basePrice = term.dealerCost;

    // Surcharges from components[0] (non-selectable loss codes)
    let surchargeCost = 0;
    if (term.components[0]) {
      for (const lc of term.components[0].lossCodes) {
        if (!lc.isSelectable && lc.isSelected) {
          surchargeCost += lc.dealerCost;
        }
      }
    }

    // Optional add-ons from components[1] (selectable loss codes)
    let optionsCost = 0;
    if (term.components[1]) {
      for (const lc of term.components[1].lossCodes) {
        if (addOnIds.has(lc.coverageLossCodeId)) {
          optionsCost += lc.dealerCost;
        }
      }
    }

    return {
      basePrice,
      surchargeCost,
      optionsCost,
      totalPrice: basePrice + surchargeCost + optionsCost,
    };
  }

  function handleSelect(rate: CoverageRate) {
    const tierName = getTierName(rate.description);
    const termIdx = getTermIndex(rate);
    const term = rate.terms[termIdx];
    const addOnIds = getAddOnSet(tierName);
    const costs = calculateTotal(term, addOnIds);

    // Collect all loss code IDs (surcharges + selected add-ons)
    const allLossCodes: number[] = [];
    if (term.components[0]) {
      for (const lc of term.components[0].lossCodes) {
        if (lc.isSelected) allLossCodes.push(lc.coverageLossCodeId);
      }
    }
    for (const id of addOnIds) {
      allLossCodes.push(id);
    }

    setVehicleCoverage(
      currentVehicleIndex,
      {
        planCode: rate.code,
        planDescription: rate.description,
        retailCost: costs.totalPrice,
        termMonths: term.termMonths,
        termOdometer: term.termOdometer,
        deductible: term.deductible,
        coverageLossCodes: allLossCodes,
      },
      costs
    );

    setStep('bundle-prompt');
  }

  // Determine the "recommended" tier (Premium if available, else highest)
  const recommendedTier = useMemo(() => {
    const names = sortedRates.map((r) => getTierName(r.description));
    if (names.includes('Premium')) return 'Premium';
    if (names.includes('Exclusive')) return 'Exclusive';
    return names[names.length - 1] ?? '';
  }, [sortedRates]);

  if (sortedRates.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <p className="text-navy-600">No coverage plans available for this vehicle.</p>
          <button
            onClick={() => setStep('vehicle-info')}
            className="mt-4 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-accent-hover"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep('vehicle-info')}
          className="flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-accent transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="text-right">
          <h2 className="text-xl font-bold font-display text-navy-900">Choose Your Protection Plan</h2>
          {vehicles[currentVehicleIndex]?.vehicle && (
            <p className="text-sm text-navy-500">
              {vehicles[currentVehicleIndex].vehicle!.vehicleYear}{' '}
              {vehicles[currentVehicleIndex].vehicle!.make}{' '}
              {vehicles[currentVehicleIndex].vehicle!.model}
            </p>
          )}
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sortedRates.map((rate) => {
          const tierName = getTierName(rate.description);
          const tierLevel = getTierLevel(rate.description);
          const termIdx = getTermIndex(rate);
          const term = rate.terms[termIdx];
          const addOnIds = getAddOnSet(tierName);
          const costs = calculateTotal(term, addOnIds);
          const isRecommended = tierName === recommendedTier;

          return (
            <div key={rate.code} className="flex flex-col gap-4">
              <PlanCard
                name={tierName}
                price={costs.totalPrice}
                frequency="one-time"
                features={getFeatures(tierName)}
                isRecommended={isRecommended}
                tierLevel={tierLevel}
                onSelect={() => handleSelect(rate)}
              />

              {/* Term Selector */}
              <div className="rounded-xl bg-white p-4 shadow-sm border border-navy-100">
                <label className="block text-xs font-semibold text-navy-500 uppercase tracking-wide mb-1.5">
                  Term Length
                </label>
                <select
                  value={termIdx}
                  onChange={(e) =>
                    setSelectedTermByTier((prev) => ({
                      ...prev,
                      [tierName]: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full rounded-lg border border-navy-100 bg-navy-50 px-3 py-2 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                >
                  {rate.terms.map((t, i) => (
                    <option key={i} value={i}>
                      {t.termMonths}mo / {t.termOdometer.toLocaleString()}mi &mdash;{' '}
                      {formatCurrency(t.dealerCost)}
                    </option>
                  ))}
                </select>

                {/* Deductible Display */}
                <p className="mt-2 text-xs text-navy-500">
                  Deductible: {formatCurrency(term.deductible.amount)} ({term.deductible.type})
                </p>

                {/* Tier Info Toggle */}
                {TIER_DESCRIPTIONS[tierName] && (
                  <button
                    onClick={() =>
                      setExpandedInfo(expandedInfo === tierName ? null : tierName)
                    }
                    className="mt-2 flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    <Info className="h-3 w-3" />
                    What&apos;s covered?
                  </button>
                )}
                {expandedInfo === tierName && TIER_DESCRIPTIONS[tierName] && (
                  <p className="mt-2 text-xs text-navy-500 leading-relaxed">
                    {TIER_DESCRIPTIONS[tierName].summary}
                  </p>
                )}

                {/* Add-on Checkboxes (from components[1]) */}
                {term.components[1] &&
                  term.components[1].lossCodes.filter((lc: LossCode) => lc.isSelectable).length > 0 && (
                    <div className="mt-3 border-t border-navy-100 pt-3">
                      <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">
                        Optional Add-Ons
                      </p>
                      <div className="space-y-1.5">
                        {term.components[1].lossCodes
                          .filter((lc: LossCode) => lc.isSelectable)
                          .map((lc: LossCode) => (
                            <label
                              key={lc.coverageLossCodeId}
                              className="flex items-center gap-2 text-xs cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={addOnIds.has(lc.coverageLossCodeId)}
                                onChange={() => toggleAddOn(tierName, lc.coverageLossCodeId)}
                                className="h-3.5 w-3.5 rounded border-navy-100 text-accent focus:ring-accent/20"
                              />
                              <span className="text-navy-600">{lc.description}</span>
                              <span className="ml-auto text-navy-500">
                                +{formatCurrency(lc.dealerCost)}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Cost Breakdown */}
                {(costs.surchargeCost > 0 || costs.optionsCost > 0) && (
                  <div className="mt-3 border-t border-navy-100 pt-3 space-y-1 text-xs text-navy-500">
                    <div className="flex justify-between">
                      <span>Base</span>
                      <span>{formatCurrency(costs.basePrice)}</span>
                    </div>
                    {costs.surchargeCost > 0 && (
                      <div className="flex justify-between">
                        <span>Surcharges</span>
                        <span>+{formatCurrency(costs.surchargeCost)}</span>
                      </div>
                    )}
                    {costs.optionsCost > 0 && (
                      <div className="flex justify-between">
                        <span>Options</span>
                        <span>+{formatCurrency(costs.optionsCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-navy-900 pt-1 border-t border-dashed border-navy-100">
                      <span>Total</span>
                      <span>{formatCurrency(costs.totalPrice)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
