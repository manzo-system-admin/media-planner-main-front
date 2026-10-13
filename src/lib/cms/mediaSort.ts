type DatedMedia = {
  id: string;
  date?: string;
  order?: number;
};

export function sortMediaByDate<T extends DatedMedia>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateDiff = (b.date ?? "").localeCompare(a.date ?? "");
    if (dateDiff !== 0) return dateDiff;
    const orderDiff = (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
    return orderDiff || a.id.localeCompare(b.id);
  });
}
