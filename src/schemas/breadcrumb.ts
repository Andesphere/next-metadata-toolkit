import type { BreadcrumbList, WithContext } from 'schema-dts';

import type { BreadcrumbItemInput } from '../types';

/**
 * BreadcrumbList schema helper.
 */
export const breadcrumbSchema = (
  items: BreadcrumbItemInput[]
): WithContext<BreadcrumbList> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};
