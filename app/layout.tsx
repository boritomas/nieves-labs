import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nieves-labs.com'),
  title: 'Nieves Labs - AI Solutions That Empower People',
  description: 'Premium AI products and automation workflows for clearer preparation, smarter operations, and practical customer outcomes.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/brand/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Nieves Labs',
    description: 'AI solutions that empower people.',
    images: ['/brand/nieves-labs-og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
      </body>
    </html>
  );
}
