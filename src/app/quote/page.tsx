'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QuoteWizard from '@/components/quote/QuoteWizard';

function QuotePageContent() {
  const searchParams = useSearchParams();
  const vin = searchParams.get('vin') ?? undefined;
  const mileageParam = searchParams.get('mileage');
  const mileage = mileageParam ? parseInt(mileageParam, 10) : undefined;
  const product = searchParams.get('product') ?? undefined;
  const isHomeOnly = product === 'home';

  return (
    <section className="min-h-screen bg-navy-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <QuoteWizard
          initialVin={vin}
          initialMileage={Number.isNaN(mileage) ? undefined : mileage}
          initialProduct={isHomeOnly ? 'home' : undefined}
        />
      </div>
    </section>
  );
}

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-navy-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      }
    >
      <QuotePageContent />
    </Suspense>
  );
}
