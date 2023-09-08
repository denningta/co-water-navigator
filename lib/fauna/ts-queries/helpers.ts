export function isFQLQuery(input: any) {
  if (input?.toQuery) return true
  return false
}
