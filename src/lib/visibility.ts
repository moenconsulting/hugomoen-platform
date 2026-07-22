interface Publishable {
  draft: boolean;
  publishDate?: string;
}

function isScheduledForFuture(publishDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return publishDate > today;
}

export function normalizeDate(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

export function isVisible(item: Publishable): boolean {
  if (item.draft) {
    return process.env.NODE_ENV !== "production";
  }
  if (item.publishDate && isScheduledForFuture(item.publishDate)) {
    return process.env.NODE_ENV !== "production";
  }
  return true;
}

export function isScheduled(item: Publishable): boolean {
  return !item.draft && !!item.publishDate && isScheduledForFuture(item.publishDate);
}
