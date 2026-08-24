export const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

export function sorted(items) {
  return [...items].sort(byOrder)
}
