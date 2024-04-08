import Navbar from '@/components/navbar'
import { cn } from '@/lib/utils'
import GlobalProviders from '@/providers/global-providers'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { ReactNode } from 'react'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Staking App',
  description: 'Web3 app for staking tokens',
  keywords: 'web3, staking, tokens, blockchain, ethereum',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/apple-touch-icon.png' },
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <GlobalProviders>
          <Navbar />
          {children}
        </GlobalProviders>
      </body>
    </html>
  )
}
