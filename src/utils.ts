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

const cloneDeep = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as T;
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneDeep(item)])
    ) as T;
  }
  return value;
};

export const deepMerge = <T extends Record<string, unknown>>(
  base?: T,
  override?: Partial<T>
): T | undefined => {
  if (!base && !override) {
    return undefined;
  }
  const result: Record<string, unknown> = base ? cloneDeep(base) : {};
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
      result[key] = cloneDeep(value);
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
  if (title === undefined || title === null) {
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
    if ('template' in title && typeof title.template === 'string') {
      return title.template;
    }
  }
  return undefined;
};

type OpenGraph = Metadata['openGraph'];

export const mergeOpenGraph = (
  base: OpenGraph | undefined,
  override: OpenGraph | null | undefined,
  fallbacks: {
    title?: string;
    description?: string;
    url?: string | URL;
  }
): OpenGraph | undefined => {
  if (override === null) {
    return undefined;
  }
  const merged = deepMerge<NonNullable<OpenGraph>>(
    (base ?? {}) as NonNullable<OpenGraph>,
    (override ?? {}) as Partial<NonNullable<OpenGraph>>
  );
  if (!merged) {
    return undefined;
  }
  // Apply fallbacks - these are page-specific and should override defaults
  if (fallbacks.title !== undefined) {
    merged.title = fallbacks.title;
  }
  if (fallbacks.description !== undefined) {
    merged.description = fallbacks.description;
  }
  if (fallbacks.url !== undefined) {
    merged.url = fallbacks.url;
  }
  return Object.keys(merged).length ? merged : undefined;
};

type Twitter = Metadata['twitter'];

export const mergeTwitter = (
  base: Twitter | undefined,
  override: Twitter | null | undefined,
  fallbacks: {
    title?: string;
    description?: string;
    images?: NonNullable<Twitter>['images'];
  }
): Twitter | undefined => {
  if (override === null) {
    return undefined;
  }
  const merged = deepMerge<NonNullable<Twitter>>(
    (base ?? {}) as NonNullable<Twitter>,
    (override ?? {}) as Partial<NonNullable<Twitter>>
  );
  if (!merged) {
    return undefined;
  }
  // Apply fallbacks - these are page-specific and should override defaults
  if (fallbacks.title !== undefined) {
    merged.title = fallbacks.title;
  }
  if (fallbacks.description !== undefined) {
    merged.description = fallbacks.description;
  }
  if (fallbacks.images !== undefined) {
    merged.images = fallbacks.images;
  }
  return Object.keys(merged).length ? merged : undefined;
};
