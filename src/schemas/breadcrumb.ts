import type { BreadcrumbList, WithContext } from 'schema-dts';

import type { BreadcrumbItemInput } from '../types';
import { isNonEmptyString, isValidUrl, warnSchema } from '../schema-utils';

/**
 * BreadcrumbList schema helper.
 */
export const breadcrumbSchema = (
  items: BreadcrumbItemInput[]
): WithContext<BreadcrumbList> => {
  if (!items.length) {
    warnSchema('breadcrumb-empty', 'Breadcrumb schema requires at least one item.');
  }

  items.forEach((item, index) => {
    if (!isNonEmptyString(item.name)) {
      warnSchema(`breadcrumb-name-${index}`, 'Breadcrumb item name is required.');
    }
    if (!isValidUrl(item.url)) {
      warnSchema(`breadcrumb-url-${index}`, 'Breadcrumb item url should be a valid absolute URL.');
    }
  });

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
