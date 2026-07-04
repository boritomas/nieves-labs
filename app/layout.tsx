import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nieves Labs - AI Product Lab',
  description: 'Practical AI product lab building AI-powered tools, automation systems, and real-world experiments.',
  openGraph: {
    title: 'Nieves Labs',
    description: 'Practical AI product lab building AI-powered tools, automation systems, and real-world experiments.',
    url: 'https://nieveslabs.com',
    siteName: 'Nieves Labs',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
