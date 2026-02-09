'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    question: 'What types of coverage does Click4Coverage offer?',
    answer:
      'We offer four tiers of auto coverage, as well as three levels of home coverage, each designed to cater to different needs and budgets. Whether you\'re looking for basic coverage or comprehensive protection, we have a plan for you.',
  },
  {
    question: 'What is auto coverage and why do I need it?',
    answer:
      'Auto coverage is a service agreement that covers specific repairs and services for your vehicle. It provides financial protection against unexpected repair costs, ensuring your vehicle remains in optimal condition.',
  },
  {
    question: 'Can I transfer my coverage if I sell my home or vehicle?',
    answer:
      'Yes, most of our coverages are transferable. This can increase the resale value of your vehicle or home, providing added benefit to both you and the buyer.',
  },
  {
    question: 'How does the purchasing process work at Click4Coverage?',
    answer:
      'Our purchasing process is simple and straightforward. Browse our coverage plans, choose the one that suits your needs, and complete the purchase online.',
  },
  {
    question: 'What is home coverage and why do I need it?',
    answer:
      'Home coverage is a service agreement that covers specific repairs and services for your home. It provides financial protection against unexpected repair costs, ensuring your home remains in optimal condition.',
  },
  {
    question: 'How do I file a claim with Click4Coverage?',
    answer:
      'Filing a claim is easy. Simply navigate to our claims portal, or call the claims number on your fulfillment packet, provide the necessary details, and we\'ll guide you through the process to ensure a smooth experience.',
  },
  {
    question: 'Are there any additional benefits with a Click4Coverage coverage?',
    answer: 'Yes, our coverages often include additional optional selections.',
  },
  {
    question: 'How long does coverage last?',
    answer:
      'The duration of coverage depends on the plan selected. We offer flexible terms to suit your needs, ranging from short-term to long-term.',
  },
  {
    question: 'What makes Click4Coverage different?',
    answer:
      'Click4Coverage stands out with our commitment to customer satisfaction, transparent pricing, and comprehensive coverage options tailored to meet diverse needs.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-mesh noise-bg relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              FAQ
            </p>
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Your Questions Answered
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-navy-100/80 sm:text-xl">
              Find answers to common questions about our coverage plans, claims process, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl border bg-white transition-all duration-300 ${
                  openIndex === index
                    ? 'border-accent/40 ring-1 ring-accent/30 shadow-lg'
                    : 'border-navy-100 shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={openIndex === index}
                >
                  <span className="pr-4 text-lg font-medium text-navy-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-accent transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 text-base leading-relaxed text-navy-600">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-mesh noise-bg relative py-24 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
            Still Have Questions?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy-100/80">
            Our team is here to help. Reach out to us and we&apos;ll get you the answers you need.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-4 text-lg font-bold text-navy-950 shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:scale-105"
            >
              Contact Us
            </a>
            <a
              href="/quote"
              className="rounded-xl border border-navy-600 px-10 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
