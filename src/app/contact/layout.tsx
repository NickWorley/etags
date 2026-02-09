import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Click for Coverage',
  description:
    'Get in touch with Click4Coverage for questions about our coverage plans or assistance.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
