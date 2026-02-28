import { Car, Search, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: Car,
    step: '01',
    title: 'Enter Vehicle Info',
    description:
      'Provide your VIN and current mileage. Takes less than 30 seconds.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Compare Coverage Plans',
    description:
      'We scan the manufacturer database and present tailored Vehicle Service Contract options.',
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Get Protected',
    description:
      'Select your plan, complete checkout, and drive with confidence. Coverage starts immediately.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-navy-50 py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="font-display text-3xl tracking-tight text-navy-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            Three simple steps to mechanical breakdown coverage.
          </p>
        </div>

        {/* Step cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item, i) => (
            <div key={item.step} className="relative flex">
              {/* Connector line between cards */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden w-8 -translate-y-1/2 translate-x-full border-t-2 border-dashed border-navy-100 lg:block" />
              )}

              <div className="relative w-full overflow-hidden rounded-xl border border-navy-100 bg-white p-8 shadow-sm">
                {/* Large step number background */}
                <span className="absolute right-6 top-4 font-display text-6xl leading-none text-navy-100">
                  {item.step}
                </span>

                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-navy-100 bg-accent-muted">
                  <item.icon className="h-7 w-7 text-accent" />
                </div>

                {/* Text */}
                <h3 className="mt-5 text-xl font-semibold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
