'use client';

import { useQuoteStore } from '@/store/quote-store';
import { Car, ArrowRight } from 'lucide-react';

export default function BundlePrompt() {
  const { vehicles, addVehicleSlot, setCurrentVehicleIndex, setStep } = useQuoteStore();

  const coveredVehicleCount = vehicles.filter((v) => v.vehicle && v.coverage).length;
  const canAddVehicle = coveredVehicleCount < 2;

  function handleAddVehicle() {
    const slotNeedsVehicle = vehicles.findIndex((v) => !v.vehicle);
    const slotNeedsPlan = vehicles.findIndex((v) => v.vehicle && !v.coverage);
    if (slotNeedsVehicle >= 0) {
      setCurrentVehicleIndex(slotNeedsVehicle);
      setStep('vehicle-info');
    } else if (slotNeedsPlan >= 0) {
      setCurrentVehicleIndex(slotNeedsPlan);
      setStep('plan-selection');
    } else if (vehicles.length < 2) {
      addVehicleSlot();
      setStep('vehicle-info');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-center text-2xl font-bold font-display text-navy-900">
          Want to Bundle More Coverage?
        </h2>
        <p className="mt-2 text-center text-sm text-navy-500">
          Save by protecting more of what matters to you.
        </p>

        <div className="mt-8 space-y-3">
          {/* Add Another Vehicle */}
          {canAddVehicle && (
            <button
              onClick={handleAddVehicle}
              className="flex w-full items-center gap-4 rounded-xl border border-navy-100 bg-navy-50 p-4 text-left transition hover:border-accent hover:bg-accent/5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted">
                <Car className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-navy-900">Add Another Vehicle</p>
                <p className="text-sm text-navy-500">
                  Protect a second vehicle with a Vehicle Service Contract.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-navy-500" />
            </button>
          )}

          {/* Continue to Review */}
          <div className="pt-2">
            <button
              onClick={() => setStep('cart-review')}
              className="w-full rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-[1.02] active:scale-100"
            >
              Continue to Review
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-navy-500">
          You can always come back to add more coverage later.
        </p>
      </div>
    </div>
  );
}
