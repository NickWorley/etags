'use client';

import { formatCurrency } from '@/lib/constants';
import { Home } from 'lucide-react';
import type { HomeCoverage } from '@/lib/types';

interface HomeCoverageSummaryProps {
  homeCoverage: HomeCoverage;
}

export default function HomeCoverageSummary({ homeCoverage }: HomeCoverageSummaryProps) {
  return (
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
  );
}
