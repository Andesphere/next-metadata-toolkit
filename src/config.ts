import type { Metadata } from 'next';

import { deepMerge, warnDescription } from './utils';
import type { SeoConfigInput, SeoDefaults } from './types';

const DEFAULT_OG_TYPE = 'website' as const;
const DEFAULT_TWITTER_CARD = 'summary_large_image' as const;

const resolveMetadataBase = (input: SeoConfigInput): URL => {
  try {
    return input.baseUrl instanceof URL ? input.baseUrl : new URL(input.baseUrl);
  } catch (error) {
    throw new Error(
      `[next-seo] Invalid baseUrl provided to createSeoConfig(): ${String(input.baseUrl)}`
    );
  }
};

export const createSeoDefaults = (input: SeoConfigInput): SeoDefaults => {
  const metadataBase = resolveMetadataBase(input);
  const defaultTitle = input.defaultTitle ?? input.siteName;
  const titleTemplate = input.titleTemplate ?? `%s | ${input.siteName}`;

  warnDescription('Default', input.defaultDescription);

  const defaultOgImages = input.defaultOgImage ? [input.defaultOgImage] : undefined;

  const openGraphDefaults: Metadata['openGraph'] = {
    title: defaultTitle,
    description: input.defaultDescription,
    siteName: input.siteName,
    locale: input.locale,
    type: DEFAULT_OG_TYPE,
    images: defaultOgImages,
  };

  const twitterDefaults: Metadata['twitter'] = {
    card: DEFAULT_TWITTER_CARD,
    creator: input.twitterHandle,
    site: input.twitterHandle,
    title: defaultTitle,
    description: input.defaultDescription,
    images: defaultOgImages,
  };

  const openGraphOverride =
    input.openGraph === null
      ? null
      : (input.openGraph ?? undefined) as Partial<NonNullable<Metadata['openGraph']>> | undefined;
  const twitterOverride =
    input.twitter === null
      ? null
      : (input.twitter ?? undefined) as Partial<NonNullable<Metadata['twitter']>> | undefined;

  const openGraph =
    openGraphOverride === null
      ? undefined
      : deepMerge(
          openGraphDefaults as NonNullable<Metadata['openGraph']>,
          openGraphOverride
        );

  const twitter =
    twitterOverride === null
      ? undefined
      : deepMerge(
          twitterDefaults as NonNullable<Metadata['twitter']>,
          twitterOverride
        );

  return {
    metadataBase,
    titleTemplate,
    defaultTitle,
    defaultDescription: input.defaultDescription,
    openGraph,
    twitter,
  };
};

/**
 * Build global Metadata defaults for your root layout.
 */
export const createSeoConfig = (input: SeoConfigInput): Metadata => {
  const defaults = createSeoDefaults(input);

  return {
    metadataBase: defaults.metadataBase,
    title: {
      default: defaults.defaultTitle,
      template: defaults.titleTemplate,
    },
    description: defaults.defaultDescription,
    openGraph: defaults.openGraph,
    twitter: defaults.twitter,
  };
};
