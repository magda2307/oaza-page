import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

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
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
