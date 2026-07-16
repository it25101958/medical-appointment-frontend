export const CACHE_REVALIDATE_SECONDS = {
  short: 30,
  medium: 60,
  long: 300,
} as const;

export const CACHE_TAGS = {
  doctors: "doctors",
  laboratories: "laboratories",
  labTests: "lab-tests",
  medications: "medications",
  prescriptions: "prescriptions",
  rooms: "rooms",
  users: "users",
} as const;

export type CachedReadOptions = RequestInit & {
  next: {
    revalidate: number;
    tags: string[];
  };
};

export function createCachedReadOptions(
  tags: string[],
  revalidate: number = CACHE_REVALIDATE_SECONDS.medium,
): CachedReadOptions {
  return {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate,
      tags,
    },
  };
}

export function createScopedCacheTag(tag: string, scope: number | string) {
  return `${tag}:${scope}`;
}
