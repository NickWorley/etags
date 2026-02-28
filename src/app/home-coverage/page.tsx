import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  Thermometer,
  Refrigerator,
  Plug,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Coverage | Click for Coverage',
  description:
    'Customized home coverage plans to protect your home systems and appliances. Affordable protection for every homeowner.',
};

/* ------------------------------------------------------------------ */
/*  Package data                                                       */
/* ------------------------------------------------------------------ */

const packages = [
  {
    name: 'Home Systems Coverage',
    icon: Thermometer,
    items: [
      'Central Heating and Cooling Systems',
      'Internal Electrical System',
      'Internal Plumbing System',
      'Ductwork',
    ],
    border: 'border-navy-100',
    extra: '',
    badge: null,
    highlighted: false,
  },
  {
    name: 'Home Total Coverage',
    icon: Home,
    items: [
      'Central Heating and Cooling Systems',
      'Washer & Dryer',
      'Kitchen Refrigerator',
      'Internal Plumbing Systems',
      'PLUS all Systems and Appliance coverage',
    ],
    border: 'border-accent',
    extra: 'bg-accent-muted ring-1 ring-accent/20 shadow-xl',
    badge: 'Best Value',
    highlighted: true,
  },
  {
    name: 'Home Appliance Coverage',
    icon: Refrigerator,
    items: [
      'Garage Door Opener',
      'Washer & Dryer',
      'Kitchen Refrigerator',
      'A Range of Cook-Top Appliances',
    ],
    border: 'border-navy-100',
    extra: '',
    badge: null,
    highlighted: false,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function HomeCoveragePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-mesh noise-bg relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Protect What Matters Most
            </h1>
            <p className="mt-4 text-xl font-semibold text-accent">
              Customized Home Coverage Plans
            </p>
          </div>

          {/* Two value-prop cards */}
          <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-3 inline-flex rounded-xl bg-accent-muted p-3">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Affordable Plans &amp; Unmatched Protection
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-100/80">
                Our budget-friendly options ensure every homeowner can access reliable coverage
                without sacrificing quality.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="mb-3 inline-flex rounded-xl bg-accent-muted p-3">
                <Plug className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-white">Clear &amp; Detailed Coverage</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-100/80">
                Each plan outlines precisely what&apos;s included, empowering you to select coverage
                that fits your home&apos;s specific needs and your financial goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl tracking-tight text-navy-900 sm:text-4xl">
            Personalized Coverage for Every Home and Budget
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-accent" />
          <p className="mt-8 text-lg leading-relaxed text-navy-600">
            Our customizable home coverage plans are built to align with your lifestyle and budget.
            Whether you need basic protection or comprehensive coverage, Click4Coverage makes it easy
            to find the perfect fit.
          </p>
        </div>
      </section>

      {/* Coverage Packages */}
      <section className="bg-navy-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-navy-900 sm:text-4xl">
              Customize and Compare Your Coverage
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-600">
              We make it simple to compare detailed protection plans and customize your coverage to
              suit your lifestyle. Choose the level of coverage that fits your home and
              finances&mdash;no guesswork, no compromises.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`card-lift relative rounded-2xl border-2 ${pkg.border} ${pkg.extra} ${
                  pkg.highlighted ? '' : 'bg-white'
                } p-6`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-navy-950 shadow-md">
                    {pkg.badge}
                  </span>
                )}

                {/* Icon + title */}
                <div className="mb-4 inline-flex rounded-xl bg-accent-muted p-3">
                  <pkg.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">{pkg.name}</h3>

                {/* Divider */}
                <div className="my-4 h-px bg-navy-100" />

                {/* Items */}
                <ul className="space-y-3">
                  {pkg.items.map((item) => {
                    const isHighlight = item.startsWith('PLUS');
                    return (
                      <li key={item} className="flex items-start gap-2">
                        {isHighlight ? (
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        )}
                        <span
                          className={`text-sm leading-relaxed ${
                            isHighlight ? 'font-semibold text-accent' : 'text-navy-700'
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-mesh noise-bg relative py-24 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
            Protect What Matters Most
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy-100/80">
            Your home is more than just a place&mdash;it&apos;s your most valued investment. With
            Click4Coverage&apos;s customizable home coverage plans, you can confidently protect your
            property against unexpected repairs, ensuring lasting security and peace of mind. Act now
            and choose coverage that safeguards your home for years to come.
          </p>
          <Link
            href="/quote?product=home"
            className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-105"
          >
            Secure Your Home Coverage
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
