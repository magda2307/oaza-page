import type { SuccessStory } from '@/types'

export const successStories: SuccessStory[] = [
  {
    id: 'marchewka-2022',
    cat_name: 'Marchewka',
    cat_photo_url: null,
    cat_photo_alt: 'Marchewka, rudy kot, siedzi na kocu i mruczy',
    diagnosis_tags: ['fiv', 'senior'],
    story_type: 'fiv_felv',
    adopter_name: 'Kasia',
    adopter_city: 'Warszawa',
    quote: 'Bałam się, że nie dam rady zaopiekować się chorym kotem. Wzięłam Marchewkę z FIV trzy lata temu. Śpi teraz na moich nogach.',
    adoption_year: 2022,
    story_slug: 'marchewka-zycie-z-fiv',
  },
  {
    id: 'benedykt-2023',
    cat_name: 'Benedykt',
    cat_photo_url: null,
    cat_photo_alt: 'Benedykt, szary kot z białymi łapami, leży na oknie z zamkniętymi oczami',
    diagnosis_tags: ['felv', 'wymaga_lekow'],
    story_type: 'fiv_felv',
    adopter_name: 'Marek',
    adopter_city: 'Kraków',
    quote: 'Weterynarze dawali mu sześć miesięcy. Minęły dwa lata i Benedykt właśnie zjadł pół kurczaka.',
    adoption_year: 2023,
  },
  {
    id: 'szarotka-2023',
    cat_name: 'Szarotka',
    cat_photo_url: null,
    cat_photo_alt: 'Szarotka, biała kotka z trzema łapami, siedzi pewnie na dywanie',
    diagnosis_tags: ['trojnog', 'po_wypadku', 'po_operacji'],
    story_type: 'po_wypadku',
    adopter_name: 'Zofia',
    adopter_city: 'Wrocław',
    quote: 'Szarotka porusza się szybciej niż mój pies. Zapomniałam, że ma trzy nogi — ona dawno zapomniała.',
    adoption_year: 2023,
    story_slug: 'szarotka-trzy-nogi-nowe-zycie',
  },
  {
    id: 'brumek-2024',
    cat_name: 'Brumek',
    cat_photo_url: null,
    cat_photo_alt: 'Brumek, ciemny pręgowany kot, leży na kolacie swojego opiekuna',
    diagnosis_tags: ['nowotwor', 'opieka_paliatywna', 'senior'],
    story_type: 'terminal',
    adopter_name: 'Piotr',
    adopter_city: 'Poznań',
    quote: 'Adoptowałem kota, żeby przeżył ze mną ostatnie miesiące. Przeżyliśmy razem półtora roku. Nie żałuję ani jednego dnia.',
    adoption_year: 2024,
    story_slug: 'brumek-ostatni-rok',
  },
]

// The "featured" spotlight story — the most emotionally complete one
export const featuredStory = successStories[0]
