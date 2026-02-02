import type { WebSite, WithContext } from 'schema-dts';

import type { WebSiteSchemaInput } from '../types';
import { isNonEmptyString, isValidUrl, warnSchema } from '../schema-utils';

/**
 * WebSite schema helper with optional SearchAction.
 */
export const websiteSchema = (input: WebSiteSchemaInput): WithContext<WebSite> => {
  const { name, url, searchUrl } = input;

  if (!isNonEmptyString(name)) {
    warnSchema('website-name', 'WebSite schema requires a name.');
  }
  if (!isValidUrl(url)) {
    warnSchema('website-url', 'WebSite url should be a valid absolute URL.');
  }
  if (searchUrl && !isValidUrl(searchUrl)) {
    warnSchema('website-search', 'WebSite searchUrl should be a valid absolute URL template.');
  }

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
    } as typeof schema.potentialAction;
  }

  return schema;
};
