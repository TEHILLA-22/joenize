const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const uploadBase = apiBase.replace(/\/api\/?$/, "");

export function imageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${uploadBase}${path}`;
}
