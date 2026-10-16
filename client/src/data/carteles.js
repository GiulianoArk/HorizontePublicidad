export function getZonasFromCarteles(items = []) {
  return [...new Set(items.map((item) => item.zona).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}
