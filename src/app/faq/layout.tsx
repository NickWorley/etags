import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | eTags',
  description:
    'Frequently asked questions about eTags vehicle service contracts and home coverage plans.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
