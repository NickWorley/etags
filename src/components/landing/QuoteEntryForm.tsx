'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function QuoteEntryForm() {
  const router = useRouter();
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanVin = vin.trim().toUpperCase();
    if (cleanVin.length !== 17) {
      setError('VIN must be exactly 17 characters.');
      return;
    }
    if (/[IOQ]/i.test(cleanVin)) {
      setError('VIN cannot contain the letters I, O, or Q.');
      return;
    }

    const miles = parseInt(mileage, 10);
    if (isNaN(miles) || miles < 0 || miles > 300000) {
      setError('Please enter a valid mileage (0 - 300,000).');
      return;
    }

    const params = new URLSearchParams({ vin: cleanVin, mileage: String(miles) });
    router.push(`/quote?${params.toString()}`);
  }

  return (
    <section className="relative -mt-8 z-20 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="rounded-2xl bg-white p-8 shadow-2xl shadow-navy-900/8 ring-1 ring-navy-100 sm:p-10">
          <h2 className="text-center font-display text-2xl text-navy-900 sm:text-3xl">
            Get Your Quote in Seconds
          </h2>
          <p className="mt-2 text-center text-sm text-navy-600">
            No phone call required. No commitment.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* VIN Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="vin" className="block text-sm font-medium text-navy-900">
                  Vehicle Identification Number (VIN)
                </label>
                <span className="rounded bg-navy-100 px-2 py-0.5 font-mono text-xs text-navy-600">
                  17 characters
                </span>
              </div>
              <input
                id="vin"
                type="text"
                maxLength={17}
                placeholder="e.g. 1HGCG5655WA014677"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                className="mt-2 block w-full rounded-xl border border-navy-100 bg-navy-50/50 px-4 py-3 font-mono text-sm tracking-wider placeholder-navy-400 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
                required
              />
              <p className="mt-1.5 text-xs text-navy-500">
                Found on your dashboard (driver&apos;s side) or inside the driver&apos;s door frame.
              </p>
            </div>

            {/* Mileage Field */}
            <div>
              <label htmlFor="mileage" className="block text-sm font-medium text-navy-900">
                Current Mileage
              </label>
              <input
                id="mileage"
                type="number"
                min={0}
                max={300000}
                placeholder="e.g. 45000"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-navy-100 bg-navy-50/50 px-4 py-3 text-sm placeholder-navy-400 transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
                required
              />
            </div>

            {/* Error display */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-bold text-navy-950 shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-[1.02] active:scale-100"
            >
              Get Your Free Quote
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
