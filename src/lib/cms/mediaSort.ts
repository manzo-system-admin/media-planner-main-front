type DatedMedia = {
  date?: string;
};

export function sortMediaByDate<T extends DatedMedia>(items: T[]): T[] {
  // ISO yyyy-mm-dd strings sort lexicographically in descending date order.
  // Keep the source order for equal dates; CMS display-order values are ignored.
  return [...items].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}
