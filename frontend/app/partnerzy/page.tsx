import type { Metadata } from 'next'
import Link from 'next/link'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Partnerzy — firmy, które wspierają Oazę',
  description:
    'Poznaj firmy, które pomagają kotom z Oazy przez wydarzenia charytatywne, zbiórki i wolontariat. Dołącz do grona partnerów.',
}

// ── Static partner data ───────────────────────────────────────────────────────
// Replace with API data once backend support is added.

type EventType = 'aukcja' | 'zbiórka' | 'wolontariat' | 'pro-bono' | 'event'

interface Partner {
  id: number
  name: string
  initials: string
  color: string          // Tailwind bg class for the avatar
  year: number
  event_name: string
  event_type: EventType
  description: string
  impact: string         // One punchy impact line
  website_url?: string
}

const partners: Partner[] = [
  {
    id: 1,
    name: 'PixelForge sp. z o.o.',
    initials: 'PF',
    color: 'bg-violet-100 text-violet-700',
    year: 2024,
    event_name: 'Aukcja charytatywna "Koty w pikselach"',
    event_type: 'aukcja',
    description:
      'Zespół PixelForge zorganizował aukcję cyfrowych ilustracji kotów z Oazy — stworzonych przez ich grafików pro bono. Licytacja trwała tydzień i zebrała grupę stałych darczyńców.',
    impact: '14 200 zł · 6 adoptowanych kotów',
  },
  {
    id: 2,
    name: 'Green Coffee Roasters',
    initials: 'GC',
    color: 'bg-emerald-100 text-emerald-700',
    year: 2024,
    event_name: '"Kawa dla Oazy" — miesiąc z misją',
    event_type: 'zbiórka',
    description:
      'Przez cały marzec Green Coffee przekazywało 2 zł od każdego sprzedanego cappuccino na fundusz leczenia kotów z FIV. Klienci mogli śledzić postępy na dedykowanej tablicy w kawiarni.',
    impact: '8 740 zł · dofinansowanie leczenia 4 kotów',
  },
  {
    id: 3,
    name: 'Studio Move Warszawa',
    initials: 'SM',
    color: 'bg-pink-100 text-pink-700',
    year: 2024,
    event_name: 'Charytatywne zajęcia jogi',
    event_type: 'event',
    description:
      'Studio Move otworzyło swoje przestrzenie na serię weekendowych zajęć jogi, z których cały dochód trafił do Oazy. Instruktorzy pracowali wolontariacko.',
    impact: '6 500 zł · sprzęt medyczny dla kotów po wypadkach',
  },
  {
    id: 4,
    name: 'Kancelaria Nowak & Wspólnicy',
    initials: 'NW',
    color: 'bg-blue-100 text-blue-700',
    year: 2023,
    event_name: 'Pro bono obsługa prawna',
    event_type: 'pro-bono',
    description:
      'Kancelaria przejęła całość obsługi prawnej Oazy — umowy adopcyjne, regulaminy, zgody RODO — bezpłatnie. Pozwoliło nam to przekierować pełny budżet na leczenie.',
    impact: '~18 000 zł wartości usług · pełna dokumentacja organizacji',
  },
  {
    id: 5,
    name: 'Manufaktura Druku',
    initials: 'MD',
    color: 'bg-amber-100 text-amber-700',
    year: 2023,
    event_name: 'Materiały marketingowe dla schroniska',
    event_type: 'pro-bono',
    description:
      'Manufaktura wyprodukowała ulotki, plakaty i identyfikatory wolontariuszy — wszystko zaprojektowane i wydrukowane nieodpłatnie. Materiały rozeszły się na 12 eventach w całej Polsce.',
    impact: '~8 000 zł wartości druku · 4 000 ulotek',
  },
  {
    id: 6,
    name: 'IT Collective',
    initials: 'IC',
    color: 'bg-cyan-100 text-cyan-700',
    year: 2023,
    event_name: 'Hackathon charytatywny',
    event_type: 'wolontariat',
    description:
      'Dwadzieścia osób spędziło weekend budując narzędzia dla Oazy — system zarządzania adopcjami i stronę z profilami kotów. Wszystko open-source, z pełną dokumentacją.',
    impact: '3 narzędzia wdrożone · 200 godzin pracy wolontariackiej',
  },
  {
    id: 7,
    name: 'Browary Mazowieckie',
    initials: 'BM',
    color: 'bg-orange-100 text-orange-700',
    year: 2023,
    event_name: '"Piwo z sercem" — edycja limitowana',
    event_type: 'zbiórka',
    description:
      'Przez jeden kwartał browary przekazywały 1 zł od każdej sprzedanej butelki serii "Mazowsze". Na etykietach znalazły się zdjęcia i imiona kotów czekających na adopcję.',
    impact: '11 300 zł · 3 koty znalazły dom przez kampanię',
  },
  {
    id: 8,
    name: 'Pracownia Architektoniczna Forma',
    initials: 'PA',
    color: 'bg-stone-100 text-stone-600',
    year: 2022,
    event_name: 'Projekt adaptacji przestrzeni dla kotów',
    event_type: 'pro-bono',
    description:
      'Architekci opracowali i nadzorowali projekt aranżacji nowego pomieszczenia dla kotów wymagających izolacji medycznej — w pełni nieodpłatnie, z doborem materiałów łatwych w dezynfekcji.',
    impact: 'Nowa izolatka dla 6 kotów jednocześnie',
  },
]

const eventTypeLabel: Record<EventType, string> = {
  aukcja:     'Aukcja',
  zbiórka:    'Zbiórka',
  wolontariat:'Wolontariat',
  'pro-bono': 'Pro bono',
  event:      'Event',
}

const eventTypeColor: Record<EventType, string> = {
  aukcja:      'bg-violet-50 text-violet-700 border-violet-200',
  zbiórka:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  wolontariat: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'pro-bono':  'bg-blue-50 text-blue-700 border-blue-200',
  event:       'bg-pink-50 text-pink-700 border-pink-200',
}

const partnershipSteps = [
  {
    num: '01',
    title: 'Napisz do nas',
    body: 'Opowiedz nam o swojej firmie i pomyśle. Nie musisz mieć gotowego planu — pracujemy razem od zera.',
  },
  {
    num: '02',
    title: 'Dopasujemy format',
    body: 'Aukcja, zbiórka, event, wolontariat, patronat medyczny — dobieramy formę do Waszych możliwości i wartości.',
  },
  {
    num: '03',
    title: 'Działamy i raportujemy',
    body: 'Transparentne rozliczenie: wiecie dokładnie, na co trafiły środki i który kot skorzystał. Zaświadczenie do odliczenia od podatku.',
  },
]

// ── Stats ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: '8', label: 'firm i organizacji' },
  { value: '14', label: 'wydarzeń charytatywnych' },
  { value: '48 740 zł', label: 'zebranych łącznie' },
  { value: '2022', label: 'rok pierwszego partnerstwa' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PartnerzyPage() {
  return (
    <main>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-20 md:py-28 overflow-hidden relative">
        {/* Decorative large numeral */}
        <span
          className="absolute -right-8 top-4 text-[18rem] font-bold text-white/5 leading-none select-none pointer-events-none"
          aria-hidden="true"
        >
          &amp;
        </span>

        <div className="max-w-5xl mx-auto px-4 relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-300 mb-4">
            Partnerzy · Współpraca
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-2xl">
            Firmy, które powiedziały tak.
          </h1>
          <p className="text-green-100 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
            Za każdą wizytą u weterynarza, każdym lekiem i każdym kotem, który znalazł dom,
            stoi sieć ludzi i firm, które postanowiły zaangażować się. To są ich historie.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#wspolpraca"
              className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Zostań partnerem
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center border border-white/50 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm"
            >
              Napisz do nas →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats band ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-100 text-center">
            {stats.map(({ value, label }) => (
              <div key={label} className="px-6 py-4 md:py-0">
                <p className="text-3xl md:text-4xl font-bold text-oaza-green mb-1">{value}</p>
                <p className="text-sm text-stone-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partner grid ──────────────────────────────────────────────────── */}
      <section className="bg-oaza-warm py-20">
        <div className="max-w-5xl mx-auto px-4">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Nasi partnerzy
            </h2>
            <p className="text-stone-600 text-lg mb-12 max-w-2xl">
              Każde partnerstwo wyglądało inaczej. Wszystkie zostawiły ślad.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((p, i) => (
              <RevealOnScroll key={p.id} delay={i * 60}>
                <article className="card h-full flex flex-col group">
                  {/* Card header */}
                  <div className="flex items-start gap-4 p-6 pb-0">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${p.color}`}
                      aria-hidden="true"
                    >
                      {p.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 leading-snug">{p.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{p.year}</p>
                    </div>
                  </div>

                  {/* Event name + type badge */}
                  <div className="px-6 pt-4">
                    <div className="flex items-start gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${eventTypeColor[p.event_type]}`}
                      >
                        {eventTypeLabel[p.event_type]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-stone-800 leading-snug">
                      {p.event_name}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="px-6 pt-3 text-sm text-stone-500 leading-relaxed flex-1">
                    {p.description}
                  </p>

                  {/* Impact */}
                  <div className="mx-6 mt-5 mb-6 bg-oaza-warm rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-oaza-green/70 mb-0.5">
                      Efekt
                    </p>
                    <p className="text-sm font-bold text-stone-800">{p.impact}</p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission restatement ───────────────────────────────────────────── */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <RevealOnScroll>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-5">
              Nie szukamy sponsorów. Szukamy sojuszników.
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              Każda firma ma inne możliwości — i każda forma pomocy zostawia realny ślad.
              Nie oczekujemy wielkich budżetów. Oczekujemy szczerości i konsekwencji.
              Jeśli Twoja firma ma wartości, które pasują do naszych — resztę wymyślimy razem.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="wspolpraca" className="bg-oaza-warm/40 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <RevealOnScroll className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-oaza-rust mb-3">
              Jak to działa
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">
              Jak zostać partnerem Oazy?
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {partnershipSteps.map((step, i) => (
              <RevealOnScroll key={step.num} delay={i * 120}>
                <div>
                  <span className="text-6xl font-bold text-oaza-green/15 leading-none block mb-3">
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-stone-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* What we offer to partners */}
          <RevealOnScroll>
            <div className="card p-8 md:p-10">
              <h3 className="text-lg font-bold text-stone-900 mb-6">
                Co oferujemy partnerom
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '📸', text: 'Relacja foto i wideo z wydarzenia do wykorzystania w komunikacji' },
                  { icon: '📄', text: 'Zaświadczenie o darowiźnie z pełnym rozliczeniem' },
                  { icon: '🐱', text: 'Imienne certyfikaty patronatu nad konkretnym kotem' },
                  { icon: '📣', text: 'Obecność logo partnera na stronie i w mediach społecznościowych' },
                  { icon: '💬', text: 'Wspólna komunikacja — historia partnerstwa opowiedziana uczciwie' },
                  { icon: '🤝', text: 'Zaangażowanie wolontariackie — wizyty w schronisku dla zespołu' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{icon}</span>
                    <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-oaza-green text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Twoja firma może napisać następną historię.
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-3">
              Nie musisz wiedzieć jak. Wystarczy, że wiesz dlaczego.
            </p>
            <p className="text-green-200/80 text-sm mb-10">
              Odpisujemy na każdą wiadomość. Zaczynamy rozmowę od słuchania.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center bg-oaza-rust text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Napisz do nas
              </Link>
              <Link
                href="/wspieraj"
                className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white hover:text-oaza-green transition-colors"
              >
                Inne formy wsparcia
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </main>
  )
}
