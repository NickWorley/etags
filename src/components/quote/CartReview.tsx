'use client';

import { useQuoteStore } from '@/store/quote-store';
import { formatCurrency } from '@/lib/constants';
import { ShoppingCart } from 'lucide-react';
import VehicleCoverageSummary from './VehicleCoverageSummary';

export default function CartReview() {
  const { vehicles, getMasterPrice, setStep, setVehiclePreview, addVehicleSlot } = useQuoteStore();

  const masterTotal = getMasterPrice();

  // Filter vehicles that have a coverage selected
  const coveredVehicles = vehicles.filter((v) => v.vehicle && v.coverage);

  // Bundle discount: 10% for 2+ vehicles
  const BUNDLE_DISCOUNT_PERCENT = 10;
  const bundleDiscount = coveredVehicles.length >= 2 ? BUNDLE_DISCOUNT_PERCENT : 0;
  const totalDiscountPercent = bundleDiscount;
  const discountAmount = masterTotal * (totalDiscountPercent / 100);
  const discountedTotal = masterTotal - discountAmount;
  const hasBundleDiscount = totalDiscountPercent > 0;

  async function handleReviewSub() {
    if (coveredVehicles.length > 0) {
      const contracts = coveredVehicles.map((v) => {
        const today = new Date().toISOString().split('T')[0];
        return {


          coverages: [
            {
              term: {
                termOdometer: v.coverage!.termOdometer,
                termMonths: v.coverage!.termMonths,
                deductible: v.coverage!.deductible,
              },
              generateForm: true,
              ...v.coverage,
            },
          ],

          // coverages: [v.coverage],
          combineForms: false,
          dealerNumber: process.env.NEXT_PUBLIC_DEALER_NUMBER_AUTO ?? '',
          saleDate: today,
          saleOdometer: v.saleOdometer,
          startingOdometer: v.saleOdometer,
          endingOdometer: v.saleOdometer + (v.coverage!.termOdometer ?? 0),
          vehicle: v.vehicle,
          //customer: customerData,
        };
      });

      const contPreview = await fetch('/api/coverage/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contracts }),
      });

      const contPrevData = await contPreview.json();
      if (!contPrevData.results[0].success) {
        console.error("Error in contract preview:", contPrevData);
        return;
      }


      contPrevData.results.forEach((preview: any, index: number) => {
        const buckets = preview.data.contracts[0].contract.buckets;
        setVehiclePreview(index, buckets);

      });

      setStep('checkout');
    }
  };

  const canProceed = coveredVehicles.length > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold font-display text-navy-900">Review Your Coverage</h2>
      </div>

      {/* Vehicle Coverages */}
      {coveredVehicles.map((v, idx) =>
        v.vehicle && v.coverage && v.costs ? (
          <VehicleCoverageSummary
            key={idx}
            vehicle={v.vehicle}
            coverage={v.coverage}
            costs={v.costs}
          />
        ) : null
      )}

      {/* Master Total */}
      <div className="rounded-2xl bg-navy-950 p-6 shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">Total Due</span>
            <div className="flex flex-col items-end gap-0.5">
              {hasBundleDiscount && (
                <span className="text-lg font-extrabold text-white/70 line-through">
                  {formatCurrency(masterTotal)}
                </span>
              )}
              <span className="text-3xl font-extrabold text-white">
                {formatCurrency(hasBundleDiscount ? discountedTotal : masterTotal)}
              </span>
            </div>
          </div>
          {hasBundleDiscount && (
            <p className="text-sm text-accent font-medium">
              {totalDiscountPercent}% bundle discount applied (−{formatCurrency(discountAmount)})
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {coveredVehicles.length < 2 && (
          <button
            onClick={() => { addVehicleSlot(); setStep('vehicle-info'); }}
            className="flex-1 rounded-lg border border-navy-100 bg-white px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
          >
            Add More Coverage
          </button>
        )}
        <button
          onClick={handleReviewSub}
          disabled={!canProceed}
          className="flex-1 rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:pointer-events-none"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
