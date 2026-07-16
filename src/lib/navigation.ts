export function getAppOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    "http://localhost:3000"
  );
}

export function buildAppUrl(
  path: string,
  searchParams?: Record<string, string | undefined>
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, getAppOrigin());

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

export function buildAppRoute(
  path: string,
  searchParams?: Record<string, string | undefined>
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const params = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();

  return queryString ? `${normalizedPath}?${queryString}` : normalizedPath;
}

export function getSafeRedirectPath(defaultPath = "/dashboard"): string {
  if (typeof window === "undefined") {
    return defaultPath;
  }

  const params = new URLSearchParams(window.location.search);
  const nextPath = params.get("next");

  if (!nextPath || !nextPath.startsWith("/")) {
    return defaultPath;
  }

  return nextPath;
}
