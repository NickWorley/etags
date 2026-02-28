import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 border-t border-navy-800 noise-bg">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Top section: Logo + Tagline + Accent Divider */}
        <div className="mb-12">
          <Link href="/" className="inline-block">
            <Image
              src="/images/etags-logo.png"
              alt="eTags"
              width={160}
              height={48}
              className="h-9 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-500">
            Protecting your investment with trusted Vehicle Service Contracts.
            Nationwide coverage backed by ASE Certified mechanics.
          </p>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent to-accent-light" />
        </div>

        {/* 4-Column Link Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Company Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-5">
              Company Information
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  About Click4Coverage
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Our Mission &amp; Values
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Customer Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 — Explore Our Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-5">
              Explore Our Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/auto-coverage"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Auto Coverage
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Legal & Privacy */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-5">
              Legal &amp; Privacy
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Legal Notices
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Support & Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-5">
              Support &amp; Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-navy-500 hover:text-navy-100 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-navy-800/60 pt-6 text-center">
          <p className="text-sm text-navy-500">
            &copy; {new Date().getFullYear()} Click for Coverage. All rights
            reserved.
          </p>
          <p className="mt-3 text-navy-600 text-xs max-w-2xl mx-auto leading-relaxed">
            Click for Coverage sells Vehicle Service Contracts, not manufacturer
            coverage. All plans are administered by PCRS and backed by licensed
            insurers. See your Service Contract for complete terms, conditions,
            and exclusions.
          </p>
        </div>
      </div>
    </footer>
  );
}
