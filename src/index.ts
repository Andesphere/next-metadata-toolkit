export { createSeoConfig } from './config';
export { makePageMetadata } from './metadata';
export { JsonLd } from './components/JsonLd';
export {
  organizationSchema,
  websiteSchema,
  productSchema,
  articleSchema,
  faqPageSchema,
  breadcrumbSchema,
} from './schemas';

export type {
  JsonLdData,
  SeoConfigInput,
  PageMetadataInput,
  OrganizationSchemaInput,
  WebSiteSchemaInput,
  ProductOfferInput,
  ProductSchemaInput,
  ArticleAuthorInput,
  ArticlePublisherInput,
  ArticleSchemaInput,
  FaqQuestionInput,
  BreadcrumbItemInput,
} from './types';
