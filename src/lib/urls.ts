/** Permit only ordinary secure external web destinations in public links. */
export function safeExternalUrl(value: string | null | undefined): string {
  if (!value?.trim()) return "";
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}
