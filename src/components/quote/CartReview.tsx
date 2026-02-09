'use client';

import { useQuoteStore } from '@/store/quote-store';
import { formatCurrency } from '@/lib/constants';
import { Car, Home, ShoppingCart } from 'lucide-react';

export default function CartReview() {
  const { vehicles, homeCoverage, getMasterPrice, setStep } = useQuoteStore();

  const masterTotal = getMasterPrice();

  // Filter vehicles that have a coverage selected
  const coveredVehicles = vehicles.filter((v) => v.vehicle && v.coverage && v.costs);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold font-display text-navy-900">Review Your Coverage</h2>
      </div>

      {/* Vehicle Coverages */}
      {coveredVehicles.map((v, idx) => (
        <div key={idx} className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted">
              <Car className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900">
                {v.vehicle!.vehicleYear} {v.vehicle!.make} {v.vehicle!.model}
              </h3>
              <p className="text-xs text-navy-500">VIN: {v.vehicle!.vin}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy-600">Protection Plan</span>
              <span className="font-medium text-navy-900">{v.coverage!.planDescription}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-600">Term</span>
              <span className="font-medium text-navy-900">
                {v.coverage!.termMonths} months / {v.coverage!.termOdometer.toLocaleString()} miles
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-600">Deductible</span>
              <span className="font-medium text-navy-900">
                {formatCurrency(v.coverage!.deductible.amount)} ({v.coverage!.deductible.type})
              </span>
            </div>

            <div className="border-t border-navy-100 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-navy-500">
                <span>Base Price</span>
                <span>{formatCurrency(v.costs!.basePrice)}</span>
              </div>
              {v.costs!.surchargeCost > 0 && (
                <div className="flex justify-between text-navy-500">
                  <span>Surcharges</span>
                  <span>+{formatCurrency(v.costs!.surchargeCost)}</span>
                </div>
              )}
              {v.costs!.optionsCost > 0 && (
                <div className="flex justify-between text-navy-500">
                  <span>Optional Add-Ons</span>
                  <span>+{formatCurrency(v.costs!.optionsCost)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-navy-900 pt-1 border-t border-dashed border-navy-100">
                <span>Vehicle Coverage Total</span>
                <span>{formatCurrency(v.costs!.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Home Coverage */}
      {homeCoverage && (
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted">
              <Home className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900">{homeCoverage.coverageTitle}</h3>
              <p className="text-xs text-navy-500">{homeCoverage.homeSizeLabel}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy-600">Package</span>
              <span className="font-medium text-navy-900">{homeCoverage.coverageTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-600">Duration</span>
              <span className="font-medium text-navy-900">
                {homeCoverage.duration} Year{homeCoverage.duration > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy-600">Home Size</span>
              <span className="font-medium text-navy-900">{homeCoverage.homeSizeLabel}</span>
            </div>

            <div className="border-t border-navy-100 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-navy-500">
                <span>Base Price</span>
                <span>
                  {formatCurrency(parseFloat(homeCoverage.priceBreakdown.suggestedRetail))}
                </span>
              </div>
              {homeCoverage.addOns.length > 0 && (
                <>
                  {homeCoverage.addOns.map((addon, i) => (
                    <div key={i} className="flex justify-between text-navy-500">
                      <span>{addon.name}</span>
                      <span>+{formatCurrency(addon.price)}</span>
                    </div>
                  ))}
                </>
              )}
              <div className="flex justify-between font-semibold text-navy-900 pt-1 border-t border-dashed border-navy-100">
                <span>Home Coverage Total</span>
                <span>{formatCurrency(homeCoverage.totalFinalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Master Total */}
      <div className="rounded-2xl bg-navy-950 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-white">Total Due</span>
          <span className="text-3xl font-extrabold text-white">
            {formatCurrency(masterTotal)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setStep('bundle-prompt')}
          className="flex-1 rounded-lg border border-navy-100 bg-white px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
        >
          Add More Coverage
        </button>
        <button
          onClick={() => setStep('checkout')}
          className="flex-1 rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-navy-950 shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-[1.02] active:scale-100"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
