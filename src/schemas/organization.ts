import type { Organization, WithContext } from 'schema-dts';

import type { OrganizationSchemaInput } from '../types';
import { isNonEmptyString, isValidUrl, warnSchema } from '../schema-utils';

/**
 * Organization schema helper.
 */
export const organizationSchema = (
  input: OrganizationSchemaInput
): WithContext<Organization> => {
  const { name, url, logo, sameAs } = input;

  if (!isNonEmptyString(name)) {
    warnSchema('org-name', 'Organization schema requires a name.');
  }
  if (!isValidUrl(url)) {
    warnSchema('org-url', 'Organization url should be a valid absolute URL.');
  }
  if (logo && !isValidUrl(logo)) {
    warnSchema('org-logo', 'Organization logo should be a valid absolute URL.');
  }
  if (sameAs) {
    sameAs.forEach((link, index) => {
      if (!isValidUrl(link)) {
        warnSchema(`org-sameas-${index}`, 'Organization sameAs entries should be valid URLs.');
      }
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(sameAs ? { sameAs } : {}),
  };
};
