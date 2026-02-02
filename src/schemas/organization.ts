import type { Organization, WithContext } from 'schema-dts';

import type { OrganizationSchemaInput } from '../types';

/**
 * Organization schema helper.
 */
export const organizationSchema = (
  input: OrganizationSchemaInput
): WithContext<Organization> => {
  const { name, url, logo, sameAs } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(sameAs ? { sameAs } : {}),
  };
};
