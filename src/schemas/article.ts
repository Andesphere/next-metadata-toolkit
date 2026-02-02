import type { Article, WithContext } from 'schema-dts';

import type { ArticleSchemaInput } from '../types';

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
