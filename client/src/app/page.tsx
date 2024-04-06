'use client'

import Home from '@/components/home'
import Install from '@/components/install'

export default function RootPage() {
  if (window.ethereum) {
    return <Home />
  } else {
    return <Install />
  }
}
