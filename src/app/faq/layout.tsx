import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Click for Coverage',
  description:
    'Frequently asked questions about Click4Coverage vehicle service contracts and home coverage plans.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
