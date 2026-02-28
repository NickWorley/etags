import Link from 'next/link';
import { Shield, Zap, Car, MapPin } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import QuoteEntryForm from '@/components/landing/QuoteEntryForm';
import TrustSignals from '@/components/landing/TrustSignals';
import HowItWorks from '@/components/landing/HowItWorks';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuoteEntryForm />

      {/* Safeguard Your Investment */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Safeguard Your Investment Today
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-accent" />
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-navy-600">
            Protecting your most valuable asset&mdash;your vehicle&mdash;is a critical
            aspect of responsible ownership. Our diverse range of{' '}
            <span className="font-semibold text-navy-900 underline decoration-accent/60 underline-offset-4">
              coverage options
            </span>{' '}
            are designed to provide you with unparalleled peace of mind. We understand that your
            vehicle represents a significant investment, and our goal is to help you safeguard it
            against unforeseen events, ensuring its longevity and your continued security.
          </p>
          <Link
            href="/quote"
            className="mt-10 inline-block rounded-xl bg-accent px-10 py-4 text-lg font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-105"
          >
            Secure Your Coverage
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-navy-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Customizable Plans */}
            <div className="card-lift rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Customizable Plans</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                Explore our flexible coverage options, thoughtfully designed to fit a variety of
                lifestyles and financial plans.
              </p>
            </div>

            {/* Quick Online Enrollment */}
            <div className="card-lift rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Quick Online Enrollment</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                Secure your coverage effortlessly with our intuitive online process, designed for
                your convenience.
              </p>
            </div>

            {/* Auto Coverage */}
            <div className="card-lift rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
                <Car className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Auto Coverage</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                Four tiers of comprehensive vehicle protection, from powertrain basics to full
                bumper-to-bumper coverage.
              </p>
            </div>

            {/* Nationwide Network */}
            <div className="card-lift rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Nationwide Network</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                Access to ASE-Certified mechanics at thousands of repair facilities across the
                country.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustSignals />
      <HowItWorks />

      {/* Final CTA */}
      <section className="bg-navy-900 relative py-24 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
            Ready to protect your investment?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy-100/80">
            Get your personalized Vehicle Service Contract quote today. It only takes 30 seconds.
          </p>
          <Link
            href="/quote"
            className="mt-10 inline-block rounded-xl bg-accent px-10 py-4 text-lg font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-105"
          >
            Start Your Quote
          </Link>
        </div>
      </section>
    </>
  );
}
