import type { Offer, Product, WithContext } from 'schema-dts';

import type { ProductSchemaInput } from '../types';
import { isNonEmptyString, isValidUrl, warnSchema } from '../schema-utils';

/**
 * Product schema helper with Offer support.
 */
export const productSchema = (input: ProductSchemaInput): WithContext<Product> => {
  const { name, description, image, brand, sku, url, offers } = input;

  if (!isNonEmptyString(name)) {
    warnSchema('product-name', 'Product schema requires a name.');
  }
  if (url && !isValidUrl(url)) {
    warnSchema('product-url', 'Product url should be a valid absolute URL.');
  }

  const images = Array.isArray(image) ? image : image ? [image] : [];
  images.forEach((imageUrl, index) => {
    if (!isValidUrl(imageUrl)) {
      warnSchema(`product-image-${index}`, 'Product image URLs should be valid absolute URLs.');
    }
  });

  if (offers) {
    if (!isNonEmptyString(offers.priceCurrency)) {
      warnSchema('product-offer-currency', 'Product offers.priceCurrency is required.');
    }
    if (offers.url && !isValidUrl(offers.url)) {
      warnSchema('product-offer-url', 'Product offers.url should be a valid absolute URL.');
    }
  }

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
    schema.offers = {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      ...(offers.availability ? { availability: offers.availability } : {}),
      ...(offers.url ? { url: offers.url } : {}),
      ...(offers.itemCondition ? { itemCondition: offers.itemCondition } : {}),
    } as Offer;
  }

  return schema;
};
