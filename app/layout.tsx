import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Nieves Labs - Practical AI Product Lab',
  description: 'Nieves Labs builds AI-powered products, automation systems, and practical experiments that help professionals and small businesses move faster and turn ideas into usable tools.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Nieves Labs - Practical AI Product Lab',
    description: 'Practical AI products for real-world work.',
    url: 'https://nieves-labs.com',
    siteName: 'Nieves Labs',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
