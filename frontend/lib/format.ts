/** Polish age label for a cat's age in whole years. */
export function ageLabel(years: number): string {
  if (years === 1) return '1 rok'
  if (years <= 4) return `${years} lata`
  return `${years} lat`
}
