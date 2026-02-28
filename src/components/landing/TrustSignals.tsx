import { Wrench, Globe, DollarSign, Clock } from 'lucide-react';

const signals = [
  {
    icon: Wrench,
    title: 'ASE Certified Mechanics',
    description:
      'All repairs performed by ASE Certified technicians at approved facilities nationwide.',
  },
  {
    icon: Globe,
    title: 'Nationwide Coverage',
    description:
      'Your Vehicle Service Contract is honored at any licensed repair facility in the country.',
  },
  {
    icon: DollarSign,
    title: '$0 Deductible Options',
    description:
      'Choose a plan with zero out-of-pocket deductible for maximum peace of mind.',
  },
  {
    icon: Clock,
    title: 'Quick Claims',
    description:
      'Streamlined claims process. We pay the repair facility directly \u2014 no reimbursement wait.',
  },
];

export default function TrustSignals() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="font-display text-3xl tracking-tight text-navy-900 sm:text-4xl">
            Protect your investment.
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            Trusted coverage backed by licensed insurers.
          </p>
        </div>

        {/* Signal cards */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className="card-lift bg-white rounded-lg border border-navy-100 shadow-sm p-6"
            >
              <div className="mb-5 h-12 w-12 rounded-lg bg-accent-muted flex items-center justify-center">
                <signal.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-navy-900">{signal.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                {signal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
