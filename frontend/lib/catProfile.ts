// Shared constants and pure helpers for cat profile pages.

export const PERSONALITY_TAGS = [
  'przytulasek', 'zabawny', 'spokojny', 'towarzyski', 'ciekawski',
  'gadatliwy', 'niezalezny', 'czuly', 'energiczny', 'zrownowazona',
  'niesmialy', 'plochliwy',
]

export const COMPAT_POSITIVE_TAGS = [
  'lubi_koty', 'lubi_psy', 'lubi_dzieci', 'tylko_do_domu',
  'dla_poczatkujacych', 'para_nierozlaczna',
]

export const COMPAT_CAUTION_TAGS = [
  'jako_jedynak', 'wymaga_doswiadczenia', 'potrzebuje_ciszy',
  'nie_dla_dzieci', 'agresywny',
]

export const HEALTH_SERIOUS_TAGS = [
  'fiv', 'felv', 'nowotwor', 'terminalnie_chory', 'opieka_paliatywna',
]

export const HEALTH_SPECIAL_TAGS = [
  'senior', 'kociak', 'trojnog', 'niewidomy', 'gluchy', 'choroba_nerek',
  'cukrzyca', 'choroba_serca', 'astma', 'ch_chwiejny', 'po_wypadku',
  'wymaga_lekow', 'po_operacji', 'bezzebny', 'w_leczeniu',
]

export const MEDICAL_CONTEXT: Record<string, string> = {
  fiv:               'Kot FIV+ może żyć wiele lat. Wirus nie przenosi się na ludzi. Potrzebuje tylko domu — jak każdy inny.',
  felv:              'FeLV wymaga monitoringu i opieki weterynaryjnej. Nie przenosi się na ludzi ani psy.',
  nowotwor:          'Leczony onkologicznie. Regularnie pod opieką weterynarza.',
  terminalnie_chory: 'Leczenie nieuleczalne — celem jest komfort i jakość ostatnich miesięcy.',
  opieka_paliatywna: 'Wymaga opieki paliatywnej: leki, wizyty weterynaryjne, cisza i spokój.',
  cukrzyca:          'Wymaga regularnych zastrzyków insuliny, dwa razy dziennie. Schemat szybko staje się rutyną.',
  choroba_nerek:     'Wymaga specjalnej diety i regularnych badań krwi.',
  choroba_serca:     'Pod stałą opieką kardiologa weterynaryjnego.',
  astma:             'Wymaga inhalatora przy atakach. Unikamy dymu, zapachów, środków czystości.',
  trojnog:           'Trzy łapy działają tak samo jak cztery. Adaptuje się szybko.',
  niewidomy:         'Niewidomy kot w stabilnym otoczeniu radzi sobie świetnie. Nie przestawiaj mebli.',
  gluchy:            'Głuchota nie przeszkadza w mruczeniu. Komunikacja przez dotyk i wibracje.',
  bezzebny:          'Bez zębów — mokra karma lub namoczona sucha. Nic mu nie brakuje.',
  wymaga_lekow:      'Regularnie przyjmuje leki. Dawkowanie jest proste, po kilku dniach staje się nawykiem.',
  po_wypadku:        'Przeszedł poważny wypadek. Zrehabilitowany — gotowy na spokojny dom.',
  po_operacji:       'Po operacji — w pełni wyleczony. Regularne kontrole weterynaryjne.',
  w_leczeniu:        'Aktualnie w trakcie leczenia. Stabilny i monitorowany.',
  senior:            'Senior potrzebuje ciepłego miejsca i spokojnego rytmu. Nie wymaga dużo — za to daje stabilną obecność.',
}

export function getHonestTruth(tags: string[]): string | null {
  if (tags.includes('fiv') || tags.includes('felv'))
    return 'Żyje z wirusem — nie przez niego. Wiele kotów z FIV dożywa sędziwego wieku.'
  if (tags.includes('terminalnie_chory') || tags.includes('opieka_paliatywna') || tags.includes('nowotwor'))
    return 'Może zostać rok. Może mniej. Każda godzina na miękkiej kanapie jest warta każdego trudu.'
  if (tags.includes('po_wypadku') || tags.includes('trojnog'))
    return 'Przeżył wypadek. Ciało się goi. Chęć do życia jest nienaruszona.'
  if (tags.includes('senior'))
    return 'Dojrzały, spokojny, wdzięczny. Wie, czego chce — i nie będzie Cię tego uczyć.'
  if (tags.includes('cukrzyca') || tags.includes('wymaga_lekow'))
    return 'Wymaga regularnej opieki. Oddaje to z nawiązką — w czystym, mruczącym spokoju.'
  return null
}

export function hasAnyTag(tags: string[], group: string[]): boolean {
  return group.some((t) => tags.includes(t))
}

export function getCompatStatus(
  tags: string[],
  yesTag?: string,
  noTag?: string,
): 'yes' | 'no' | 'unknown' {
  if (yesTag && tags.includes(yesTag)) return 'yes'
  if (noTag && tags.includes(noTag)) return 'no'
  return 'unknown'
}

export function deriveIdealHomeBullets(tags: string[]): string[] {
  const bullets: string[] = []
  if (tags.includes('niesmialy') || tags.includes('plochliwy') || tags.includes('potrzebuje_ciszy'))
    bullets.push('Spokojne, ciche otoczenie — bez głośnej muzyki, bez zamieszania')
  if (tags.includes('jako_jedynak'))
    bullets.push('Najlepiej bez innych kotów, przynajmniej na początku')
  if (tags.includes('nie_dla_dzieci'))
    bullets.push('Nie dla rodzin z małymi dziećmi')
  if (tags.includes('tylko_do_domu'))
    bullets.push('Dom bez wyjścia na zewnątrz — kot wyłącznie domowy')
  if (tags.includes('wymaga_doswiadczenia'))
    bullets.push('Opiekun z doświadczeniem w pracy z nieśmiałymi lub chorymi kotami')
  if (tags.includes('dla_poczatkujacych'))
    bullets.push('Świetny wybór dla kogoś, kto adoptuje kota po raz pierwszy')
  if (tags.includes('para_nierozlaczna'))
    bullets.push('Musi być adoptowany razem ze swoim partnerem — nierozłączna para')
  if (tags.includes('wymaga_lekow') || tags.includes('cukrzyca'))
    bullets.push('Właściciel gotowy na codzienną rutynę podawania leków')
  return bullets
}
