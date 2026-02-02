import type { Article, WithContext } from 'schema-dts';

import type { ArticleSchemaInput } from '../types';
import { isNonEmptyString, isValidIsoDate, isValidUrl, warnSchema } from '../schema-utils';

/**
 * Article schema helper (ideal for blog posts).
 */
export const articleSchema = (input: ArticleSchemaInput): WithContext<Article> => {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    publisher,
    url,
  } = input;

  if (!isNonEmptyString(headline)) {
    warnSchema('article-headline', 'Article schema requires a headline.');
  }
  if (!isValidIsoDate(datePublished)) {
    warnSchema('article-date-published', 'Article datePublished should be a valid ISO date string.');
  }
  if (dateModified && !isValidIsoDate(dateModified)) {
    warnSchema('article-date-modified', 'Article dateModified should be a valid ISO date string.');
  }
  if (!isNonEmptyString(author?.name)) {
    warnSchema('article-author', 'Article schema requires an author name.');
  }
  if (url && !isValidUrl(url)) {
    warnSchema('article-url', 'Article url should be a valid absolute URL.');
  }

  const images = Array.isArray(image) ? image : image ? [image] : [];
  images.forEach((imageUrl, index) => {
    if (!isValidUrl(imageUrl)) {
      warnSchema(`article-image-${index}`, 'Article image URLs should be valid absolute URLs.');
    }
  });

  if (publisher?.url && !isValidUrl(publisher.url)) {
    warnSchema('article-publisher-url', 'Article publisher.url should be a valid absolute URL.');
  }
  if (publisher?.logo && !isValidUrl(publisher.logo)) {
    warnSchema('article-publisher-logo', 'Article publisher.logo should be a valid absolute URL.');
  }
  if (publisher && !isNonEmptyString(publisher.name)) {
    warnSchema('article-publisher', 'Article publisher.name should be provided when publisher is set.');
  }

  const schema: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(url ? { url } : {}),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url ? { url: author.url } : {}),
    },
  };

  if (author.url && !isValidUrl(author.url)) {
    warnSchema('article-author-url', 'Article author.url should be a valid absolute URL.');
  }

  if (publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.url ? { url: publisher.url } : {}),
      ...(publisher.logo
        ? {
            logo: {
              '@type': 'ImageObject',
              url: publisher.logo,
            },
          }
        : {}),
    };
  }

  return schema;
};
