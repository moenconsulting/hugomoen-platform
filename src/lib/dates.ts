export function formatDate(dateString: string, locale = "nb"): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString(locale === "en" ? "en-GB" : "nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
