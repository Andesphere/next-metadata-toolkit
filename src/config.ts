import type { Metadata } from 'next';

import { setSeoDefaults } from './state';
import { deepMerge, warnDescription } from './utils';
import type { SeoConfigInput } from './types';

const DEFAULT_OG_TYPE = 'website' as const;
const DEFAULT_TWITTER_CARD = 'summary_large_image' as const;

/**
 * Build global Metadata defaults for your root layout.
 */
export const createSeoConfig = (input: SeoConfigInput): Metadata => {
  const metadataBase = input.baseUrl instanceof URL ? input.baseUrl : new URL(input.baseUrl);
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
    (input.openGraph ?? undefined) as Partial<NonNullable<Metadata['openGraph']>> | undefined;
  const twitterOverride =
    (input.twitter ?? undefined) as Partial<NonNullable<Metadata['twitter']>> | undefined;

  const openGraph = deepMerge(
    openGraphDefaults as NonNullable<Metadata['openGraph']>,
    openGraphOverride
  );

  const twitter = deepMerge(
    twitterDefaults as NonNullable<Metadata['twitter']>,
    twitterOverride
  );

  setSeoDefaults({
    metadataBase,
    titleTemplate,
    defaultTitle,
    defaultDescription: input.defaultDescription,
    openGraph,
    twitter,
  });

  return {
    metadataBase,
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description: input.defaultDescription,
    openGraph,
    twitter,
  };
};
