import type { Metadata } from 'next';

import { getSeoDefaults } from './state';
import {
  mergeOpenGraph,
  mergeTwitter,
  normalizeCanonical,
  resolveTitle,
  warnDescription,
  warnDev,
} from './utils';
import type { PageMetadataInput } from './types';

/**
 * Build page-level Metadata while preserving global defaults.
 */
export const makePageMetadata = (input: PageMetadataInput): Metadata => {
  const {
    canonical,
    pathname,
    alternates: alternatesInput,
    openGraph: openGraphInput,
    twitter: twitterInput,
    title,
    description,
    ...rest
  } = input;

  const defaults = getSeoDefaults();

  if (!defaults) {
    warnDev(
      'defaults-missing',
      'createSeoConfig() was not called. Set it in your root layout to enable defaults.'
    );
  }

  if (!defaults?.metadataBase) {
    warnDev(
      'metadata-base-missing',
      'metadataBase is not configured. Set baseUrl in createSeoConfig() to resolve relative URLs.'
    );
  }

  warnDescription('Page', description);

  const canonicalValue = normalizeCanonical(
    (canonical ?? alternatesInput?.canonical ?? pathname) as string | URL | undefined
  );

  const resolvedTitle = resolveTitle(title);

  const openGraph = mergeOpenGraph(defaults?.openGraph, openGraphInput, {
    title: resolvedTitle,
    description: description ?? undefined,
    url: canonicalValue,
  });

  const twitter = mergeTwitter(defaults?.twitter, twitterInput, {
    title: resolvedTitle,
    description: description ?? undefined,
    images: (openGraph?.images as NonNullable<Metadata['twitter']>['images']) ?? undefined,
  });

  const alternates = canonicalValue
    ? {
        ...(alternatesInput ?? {}),
        canonical: canonicalValue,
      }
    : alternatesInput;

  return {
    ...rest,
    title,
    description,
    alternates,
    openGraph,
    twitter,
  };
};
