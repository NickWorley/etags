import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Users, Lightbulb, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | eTags',
  description:
    'Learn about eTags - our commitment to exceptional coverage solutions for vehicles and homes.',
};

const coreValues = [
  {
    icon: Shield,
    title: 'Integrity',
    description:
      'We believe in transparent operations, providing honest and straightforward information to our clients.',
  },
  {
    icon: Users,
    title: 'Customer-Centricity',
    description:
      'Our customer-first approach prioritizes your needs by offering tailored solutions that fit your lifestyle.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We continuously seek new ways to enhance your experience and deliver unparalleled service.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-mesh relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Our Commitment
            </p>
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Driven by Excellence
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-navy-100/80 sm:text-xl">
              At eTags, our goal is to deliver exceptional coverage solutions that give
              customers unmatched confidence and security. Driven by a passion for excellence, we
              offer innovative coverage plans and dedicated support, earning us the trust of
              homeowners and drivers nationwide. Transparency and clarity guide every service we
              provide, ensuring we meet the unique needs of each customer.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border-l-4 border-accent bg-white p-8 shadow-lg sm:p-12">
            <h2 className="font-display text-3xl tracking-tight text-navy-900 sm:text-4xl">
              Building Trust Through Innovation
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-navy-600">
              At eTags, our foundation is built upon a commitment to revolutionize home and
              auto coverage through transparency and customer-focused solutions. From humble
              beginnings, we&apos;ve grown into an industry leader, providing a variety of
              personalized coverage plans designed to protect your investment. Our continuous
              dedication to quality and innovation has solidified lasting relationships with our
              customers nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-navy-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl tracking-tight text-navy-900 sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-3 text-lg text-navy-600">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="card-lift rounded-2xl bg-white p-8 shadow-md"
              >
                <div className="mb-5 inline-flex rounded-full bg-accent-muted p-4">
                  <value.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy-900 relative py-24 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
            Secure Your Coverage Today
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy-100/80">
            Discover the perfect coverage plan tailored to your needs. Reach out to eTags
            now and ensure peace of mind on the road. Our team is ready to assist you in finding the
            best coverage. Act now to protect your investment!
          </p>
          <Link
            href="/quote"
            className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-action px-10 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-action/20 transition hover:bg-action-hover hover:scale-105"
          >
            Explore Options
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
