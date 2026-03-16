// Colorful tag chips for cat personality, health, and compatibility labels.
// Tag keys are stored in the DB; this file owns the label and color for each.

type TagMeta = { label: string; className: string }

const TAG_META: Record<string, TagMeta> = {
  // ── Personality — emerald ──────────────────────────────────────────────
  przytulasek:          { label: 'Przytulasek',          className: 'bg-emerald-100 text-emerald-800' },
  zabawny:              { label: 'Zabawny',               className: 'bg-emerald-100 text-emerald-800' },
  spokojny:             { label: 'Spokojny',              className: 'bg-emerald-100 text-emerald-800' },
  towarzyski:           { label: 'Towarzyski',            className: 'bg-emerald-100 text-emerald-800' },
  ciekawski:            { label: 'Ciekawski',             className: 'bg-emerald-100 text-emerald-800' },
  gadatliwy:            { label: 'Gadatliwy',             className: 'bg-emerald-100 text-emerald-800' },
  niezalezny:           { label: 'Niezależny',            className: 'bg-emerald-100 text-emerald-800' },
  czuly:                { label: 'Czuły',                 className: 'bg-emerald-100 text-emerald-800' },
  energiczny:           { label: 'Energiczny',            className: 'bg-emerald-100 text-emerald-800' },
  zrownowazona:         { label: 'Zrównoważony',          className: 'bg-emerald-100 text-emerald-800' },

  // ── Compatibility — sky blue ───────────────────────────────────────────
  lubi_koty:            { label: 'Lubi koty',             className: 'bg-sky-100 text-sky-800' },
  lubi_psy:             { label: 'Lubi psy',              className: 'bg-sky-100 text-sky-800' },
  lubi_dzieci:          { label: 'Lubi dzieci',           className: 'bg-sky-100 text-sky-800' },
  tylko_do_domu:        { label: 'Tylko dom',             className: 'bg-sky-100 text-sky-800' },
  dla_poczatkujacych:   { label: 'Dla początkujących',    className: 'bg-sky-100 text-sky-800' },
  para_nierozlaczna:    { label: 'Para nierozłączna',     className: 'bg-sky-100 text-sky-800' },

  // ── Caution / behavioral — amber ─────────────────────────────────────
  niesmialy:            { label: 'Nieśmiały',             className: 'bg-amber-100 text-amber-800' },
  plochliwy:            { label: 'Płochliwy',             className: 'bg-amber-100 text-amber-800' },
  jako_jedynak:         { label: 'Jako jedynak',          className: 'bg-amber-100 text-amber-800' },
  wymaga_doswiadczenia: { label: 'Wymaga doświadczenia',  className: 'bg-amber-100 text-amber-800' },
  potrzebuje_ciszy:     { label: 'Potrzebuje ciszy',      className: 'bg-amber-100 text-amber-800' },
  nie_dla_dzieci:       { label: 'Nie dla dzieci',        className: 'bg-amber-100 text-amber-800' },
  agresywny:            { label: 'Agresywny',             className: 'bg-orange-100 text-orange-900' },

  // ── Health — serious / red ────────────────────────────────────────────
  fiv:                  { label: 'FIV+',                  className: 'bg-red-100 text-red-800' },
  felv:                 { label: 'FeLV+',                 className: 'bg-red-100 text-red-800' },
  nowotwor:             { label: 'Nowotwór',              className: 'bg-red-100 text-red-800' },
  terminalnie_chory:    { label: 'Terminalnie chory',     className: 'bg-red-100 text-red-800' },
  opieka_paliatywna:    { label: 'Opieka paliatywna',     className: 'bg-red-100 text-red-800' },

  // ── Health — special needs / violet ───────────────────────────────────
  senior:               { label: 'Senior',                className: 'bg-violet-100 text-violet-800' },
  kociak:               { label: 'Kociak',                className: 'bg-violet-100 text-violet-800' },
  trojnog:              { label: 'Trójnóg',               className: 'bg-violet-100 text-violet-800' },
  niewidomy:            { label: 'Niewidomy',             className: 'bg-violet-100 text-violet-800' },
  gluchy:               { label: 'Głuchy',                className: 'bg-violet-100 text-violet-800' },
  choroba_nerek:        { label: 'Choroba nerek',         className: 'bg-violet-100 text-violet-800' },
  cukrzyca:             { label: 'Cukrzyca',              className: 'bg-violet-100 text-violet-800' },
  choroba_serca:        { label: 'Choroba serca',         className: 'bg-violet-100 text-violet-800' },
  astma:                { label: 'Astma',                 className: 'bg-violet-100 text-violet-800' },
  ch_chwiejny:          { label: 'CH',                    className: 'bg-violet-100 text-violet-800' },
  po_wypadku:           { label: 'Po wypadku',            className: 'bg-violet-100 text-violet-800' },
  wymaga_lekow:         { label: 'Wymaga leków',          className: 'bg-violet-100 text-violet-800' },
  po_operacji:          { label: 'Po operacji',           className: 'bg-violet-100 text-violet-800' },
  bezzebny:             { label: 'Bezzębny',              className: 'bg-violet-100 text-violet-800' },
  w_leczeniu:           { label: 'W leczeniu',            className: 'bg-violet-100 text-violet-800' },
}

// Ordered list of all available tags, grouped for the admin picker
export const TAG_GROUPS: { heading: string; keys: string[] }[] = [
  {
    heading: 'Osobowość',
    keys: ['przytulasek', 'zabawny', 'spokojny', 'towarzyski', 'ciekawski',
           'gadatliwy', 'niezalezny', 'czuly', 'energiczny', 'zrownowazona'],
  },
  {
    heading: 'Zgodność',
    keys: ['lubi_koty', 'lubi_psy', 'lubi_dzieci', 'tylko_do_domu',
           'dla_poczatkujacych', 'para_nierozlaczna'],
  },
  {
    heading: 'Wymagania',
    keys: ['niesmialy', 'plochliwy', 'jako_jedynak', 'wymaga_doswiadczenia',
           'potrzebuje_ciszy', 'nie_dla_dzieci', 'agresywny'],
  },
  {
    heading: 'Poważne choroby',
    keys: ['fiv', 'felv', 'nowotwor', 'terminalnie_chory', 'opieka_paliatywna'],
  },
  {
    heading: 'Specjalne potrzeby',
    keys: ['senior', 'kociak', 'trojnog', 'niewidomy', 'gluchy', 'choroba_nerek',
           'cukrzyca', 'choroba_serca', 'astma', 'ch_chwiejny', 'po_wypadku',
           'wymaga_lekow', 'po_operacji', 'bezzebny', 'w_leczeniu'],
  },
]

// ── Display components ─────────────────────────────────────────────────────

type Size = 'sm' | 'md'

function Chip({ tagKey, size = 'md' }: { tagKey: string; size?: Size }) {
  const meta = TAG_META[tagKey]
  if (!meta) return null
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${padding} ${meta.className}`}>
      {meta.label}
    </span>
  )
}

/** Full tag list — used on the cat profile page */
export function CatTags({ tags, size = 'md' }: { tags: string[]; size?: Size }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Chip key={t} tagKey={t} size={size} />
      ))}
    </div>
  )
}

/** Compact — first 3 tags only, used on listing cards */
export function CatTagsCompact({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null
  const visible = tags.slice(0, 3)
  const rest = tags.length - visible.length
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {visible.map((t) => (
        <Chip key={t} tagKey={t} size="sm" />
      ))}
      {rest > 0 && (
        <span className="text-xs text-stone-400">+{rest}</span>
      )}
    </div>
  )
}

/** Interactive picker — used in admin forms */
export function TagPicker({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (tags: string[]) => void
}) {
  const toggle = (key: string) => {
    onChange(
      selected.includes(key) ? selected.filter((t) => t !== key) : [...selected, key],
    )
  }

  return (
    <div className="space-y-4">
      {TAG_GROUPS.map(({ heading, keys }) => (
        <div key={heading}>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-2">
            {heading}
          </p>
          <div className="flex flex-wrap gap-2">
            {keys.map((key) => {
              const meta = TAG_META[key]
              if (!meta) return null
              const active = selected.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-all ${
                    active
                      ? `${meta.className} border-current`
                      : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
