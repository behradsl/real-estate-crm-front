/** Allow only same-origin relative paths (blocks open redirects). */
export function safeInternalPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  if (trimmed.includes("\\")) return fallback;
  // Basic path characters only
  if (!/^\/[A-Za-z0-9/_?&=.%-]*$/.test(trimmed)) return fallback;
  return trimmed;
}
