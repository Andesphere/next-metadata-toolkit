import type { WebSite, WithContext } from 'schema-dts';

import type { WebSiteSchemaInput } from '../types';

/**
 * WebSite schema helper with optional SearchAction.
 */
export const websiteSchema = (input: WebSiteSchemaInput): WithContext<WebSite> => {
  const { name, url, searchUrl } = input;

  const schema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };

  if (searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
};
