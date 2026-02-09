import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-mesh noise-bg relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left column — text */}
          <div className="lg:w-7/12">
            {/* Badge */}
            <div className="animate-fade-up stagger-1 mb-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm text-accent backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Vehicle Service Contracts
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up stagger-2 font-display text-5xl leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
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
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-105"
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

          {/* Right column — decorative geometric art */}
          <div className="relative hidden lg:block lg:w-5/12">
            <div className="relative h-[480px] w-full">
              {/* Large accent circle */}
              <div className="absolute right-8 top-4 h-72 w-72 rounded-full bg-accent/10 blur-sm" />
              {/* Medium blue rounded rect */}
              <div className="absolute right-24 top-20 h-48 w-56 rounded-3xl bg-action/15 backdrop-blur-sm" />
              {/* Small emerald circle */}
              <div className="absolute bottom-24 right-12 h-40 w-40 rounded-full bg-emerald-500/10" />
              {/* Accent rounded rect overlay */}
              <div className="absolute right-32 top-48 h-44 w-44 rounded-2xl border border-accent/20 bg-accent/5 backdrop-blur-sm" />
              {/* Small circle accent */}
              <div className="absolute bottom-40 right-56 h-24 w-24 rounded-full border border-accent/15 bg-accent/8" />
              {/* Blue outline circle */}
              <div className="absolute right-4 bottom-12 h-32 w-32 rounded-full border-2 border-action/20" />
              {/* Inner glow */}
              <div className="absolute right-16 top-32 h-64 w-64 rounded-full bg-accent/5 blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
