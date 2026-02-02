import type { Metadata } from 'next';

import {
  mergeOpenGraph,
  mergeTwitter,
  normalizeCanonical,
  resolveTitle,
  warnDescription,
  warnDev,
} from './utils';
import type { PageMetadataInput, SeoDefaults } from './types';

type TwitterImages = NonNullable<Metadata['twitter']>['images'];
type TwitterImage = TwitterImages extends Array<infer T> ? T : TwitterImages;

type OpenGraphImages = NonNullable<Metadata['openGraph']>['images'];

type OpenGraphImage = OpenGraphImages extends Array<infer T> ? T : OpenGraphImages;

const mapOpenGraphImagesToTwitter = (
  images?: OpenGraphImages
): TwitterImages | undefined => {
  if (!images) {
    return undefined;
  }
  const list = Array.isArray(images) ? images : [images];
  const mapped = list.map((image) => {
    if (typeof image === 'string' || image instanceof URL) {
      return image as TwitterImage;
    }
    if (image && typeof image === 'object') {
      const { url, alt, width, height } = image as {
        url: string | URL;
        alt?: string;
        width?: number;
        height?: number;
      };
      return {
        url,
        ...(alt ? { alt } : {}),
        ...(typeof width === 'number' ? { width } : {}),
        ...(typeof height === 'number' ? { height } : {}),
      } as TwitterImage;
    }
    return image as OpenGraphImage as TwitterImage;
  });
  return mapped as TwitterImages;
};

/**
 * Build page-level Metadata while preserving global defaults.
 */
export const makePageMetadata = (
  input: PageMetadataInput,
  defaults?: SeoDefaults
): Metadata => {
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

  if (!defaults) {
    warnDev(
      'defaults-missing',
      'createSeoDefaults() was not called. Pass its return value to makePageMetadata() to enable defaults.'
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
    images: mapOpenGraphImagesToTwitter(openGraph?.images),
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
