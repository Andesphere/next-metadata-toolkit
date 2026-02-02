import type { Metadata } from 'next';

const warned = new Set<string>();
const isDev = process.env.NODE_ENV !== 'production';

export const warnDev = (key: string, message: string) => {
  if (!isDev || warned.has(key)) {
    return;
  }
  warned.add(key);
  console.warn(`[next-seo] ${message}`);
};

export const warnDescription = (context: string, description?: string | null) => {
  if (!isDev) {
    return;
  }
  const value = typeof description === 'string' ? description.trim() : '';
  if (!value) {
    warnDev(
      `desc-missing-${context}`,
      `${context} description is missing. Aim for at least 50 characters.`
    );
    return;
  }
  if (value.length < 50) {
    warnDev(
      `desc-short-${context}`,
      `${context} description is short (${value.length} chars). Aim for at least 50 characters.`
    );
  }
};

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

export const deepMerge = <T extends Record<string, unknown>>(
  base?: T,
  override?: Partial<T>
): T | undefined => {
  if (!base && !override) {
    return undefined;
  }
  const result: Record<string, unknown> = { ...(base ?? {}) };
  if (!override) {
    return result as T;
  }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) {
      continue;
    }
    const existing = result[key];
    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
};

export const normalizeCanonical = (
  value?: string | URL
): string | URL | undefined => {
  if (!value) {
    return undefined;
  }
  if (value instanceof URL) {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
  if (hasProtocol || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `/${trimmed}`;
};

export const resolveTitle = (title?: Metadata['title']): string | undefined => {
  if (!title) {
    return undefined;
  }
  if (typeof title === 'string') {
    return title;
  }
  if (typeof title === 'object') {
    if ('absolute' in title && typeof title.absolute === 'string') {
      return title.absolute;
    }
    if ('default' in title && typeof title.default === 'string') {
      return title.default;
    }
  }
  return undefined;
};

type OpenGraph = Metadata['openGraph'];

export const mergeOpenGraph = (
  base: OpenGraph | undefined,
  override: OpenGraph | undefined,
  fallbacks: {
    title?: string;
    description?: string;
    url?: string | URL;
  }
): OpenGraph | undefined => {
  const merged = deepMerge<NonNullable<OpenGraph>>(
    (base ?? {}) as NonNullable<OpenGraph>,
    (override ?? {}) as Partial<NonNullable<OpenGraph>>
  );
  if (!merged) {
    return undefined;
  }
  if (fallbacks.title && merged.title == null) {
    merged.title = fallbacks.title;
  }
  if (fallbacks.description && merged.description == null) {
    merged.description = fallbacks.description;
  }
  if (fallbacks.url && merged.url == null) {
    merged.url = fallbacks.url;
  }
  return Object.keys(merged).length ? merged : undefined;
};

type Twitter = Metadata['twitter'];

export const mergeTwitter = (
  base: Twitter | undefined,
  override: Twitter | undefined,
  fallbacks: {
    title?: string;
    description?: string;
    images?: NonNullable<Twitter>['images'];
  }
): Twitter | undefined => {
  const merged = deepMerge<NonNullable<Twitter>>(
    (base ?? {}) as NonNullable<Twitter>,
    (override ?? {}) as Partial<NonNullable<Twitter>>
  );
  if (!merged) {
    return undefined;
  }
  if (fallbacks.title && merged.title == null) {
    merged.title = fallbacks.title;
  }
  if (fallbacks.description && merged.description == null) {
    merged.description = fallbacks.description;
  }
  if (fallbacks.images && merged.images == null) {
    merged.images = fallbacks.images;
  }
  return Object.keys(merged).length ? merged : undefined;
};
