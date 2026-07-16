import axios from "axios";

type ErrorRecord = Record<string, unknown>;

function isErrorRecord(
  value: unknown
): value is ErrorRecord {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function firstString(
  value: unknown
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    const item = value.find(
      (entry): entry is string =>
        typeof entry === "string"
    );

    return item ?? null;
  }

  return null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data =
    error.response?.data;

  if (!isErrorRecord(data)) {
    return fallback;
  }

  const message =
    firstString(data.detail) ??
    firstString(data.error) ??
    firstString(data.message) ??
    firstString(data.non_field_errors);

  if (!message) {
    return fallback;
  }

  const normalized =
    message.toLowerCase();

  if (
    normalized.includes(
      "not verified"
    ) ||
    normalized.includes(
      "verify your email"
    ) ||
    normalized.includes(
      "inactive"
    )
  ) {
    return "Email not verified. Please verify your email before logging in.";
  }

  if (
    normalized.includes(
      "invalid credentials"
    ) ||
    normalized.includes(
      "no active account"
    )
  ) {
    return "Invalid email or password.";
  }

  return message;
}
