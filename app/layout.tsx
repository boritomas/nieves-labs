import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Nieves Labs - AI Integration for Developers',
  description: 'Build intelligent applications with confidence. Access production-ready AI integration tools, SDKs, and community resources to bring AI into your apps.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Nieves Labs - AI Integration for Developers',
    description: 'Build intelligent applications with confidence.',
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
      <body className={`${inter.className} bg-white text-primary-dark antialiased`}>
        {children}
      </body>
    </html>
  );
}
