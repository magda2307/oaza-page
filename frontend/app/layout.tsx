import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Oaza — przytulisko dla kotów',
    template: '%s | Oaza',
  },
  description:
    'Oaza to warszawskie przytulisko dla kotów, których nikt inny nie chciał — z nieuleczalnymi chorobami, FIV/FeLV, po wypadkach drogowych. Adoptuj, wspieraj, ratuj życie.',
  metadataBase: new URL('https://oaza.pl'),
  keywords: ['adopcja kotów', 'przytulisko dla kotów', 'Warszawa', 'FIV', 'FeLV', 'kotki do adopcji'],
  openGraph: {
    siteName: 'Oaza',
    locale: 'pl_PL',
    type: 'website',
    title: 'Oaza — przytulisko dla kotów',
    description: 'Przyjmujemy koty, których nikt inny nie chciał. Adoptuj lub wspieraj.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
