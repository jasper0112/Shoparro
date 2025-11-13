import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Southside Cart - E-Commerce Platform',
  description: 'E-Commerce Platform for Australian SMEs',
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

