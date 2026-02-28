import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-mesh relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-fade-up stagger-1 mb-8 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Vehicle Service Contracts
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up stagger-2 font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your vehicle deserves{' '}
            <span className="text-accent">more</span> than factory limits.
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up stagger-3 mt-6 max-w-xl text-lg leading-relaxed text-navy-100/70">
            Get a Vehicle Service Contract quote in seconds. No phone call.
            No commitment. Just confidence.
          </p>

          {/* CTA Row */}
          <div className="animate-fade-up stagger-4 mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/quote"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-105"
            >
              Get Your Free Quote
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-navy-600 px-8 py-4 text-lg font-semibold text-navy-100 transition hover:bg-white/5"
            >
              See How It Works
            </Link>
          </div>

          {/* Micro stats */}
          <div className="animate-fade-up stagger-5 mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-500">
            <span>4 Coverage Tiers</span>
            <span className="text-navy-700">&middot;</span>
            <span>Nationwide Network</span>
            <span className="text-navy-700">&middot;</span>
            <span>$0 Deductible Options</span>
          </div>
        </div>
      </div>
    </section>
  );
}
