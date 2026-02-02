import type { Offer, Product, WithContext } from 'schema-dts';

import type { ProductSchemaInput } from '../types';

/**
 * Product schema helper with Offer support.
 */
export const productSchema = (input: ProductSchemaInput): WithContext<Product> => {
  const { name, description, image, brand, sku, url, offers } = input;

  const schema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(sku ? { sku } : {}),
    ...(url ? { url } : {}),
  };

  if (brand) {
    schema.brand = {
      '@type': 'Brand',
      name: brand,
    };
  }

  if (offers) {
    const offer: Offer = {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      ...(offers.availability ? { availability: offers.availability } : {}),
      ...(offers.url ? { url: offers.url } : {}),
      ...(offers.itemCondition ? { itemCondition: offers.itemCondition } : {}),
    };

    schema.offers = offer;
  }

  return schema;
};
