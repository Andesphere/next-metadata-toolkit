import type { Metadata } from 'next';
import type { Thing, WithContext } from 'schema-dts';

export type JsonLdData = WithContext<Thing> | Array<WithContext<Thing>>;

export interface SeoConfigInput {
  siteName: string;
  titleTemplate?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  baseUrl: string | URL;
  defaultOgImage?: string;
  twitterHandle?: string;
  locale?: string;
  openGraph?: Metadata['openGraph'];
  twitter?: Metadata['twitter'];
}

export type PageMetadataInput = Omit<Metadata, 'metadataBase'> & {
  canonical?: string | URL;
  pathname?: string;
};

export interface OrganizationSchemaInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export interface WebSiteSchemaInput {
  name: string;
  url: string;
  searchUrl?: string;
}

export interface ProductOfferInput {
  price: number | string;
  priceCurrency: string;
  availability?: string;
  url?: string;
  itemCondition?: string;
}

export interface ProductSchemaInput {
  name: string;
  description?: string;
  image?: string | string[];
  brand?: string;
  sku?: string;
  url?: string;
  offers?: ProductOfferInput;
}

export interface ArticleAuthorInput {
  name: string;
  url?: string;
}

export interface ArticlePublisherInput {
  name: string;
  logo?: string;
  url?: string;
}

export interface ArticleSchemaInput {
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: ArticleAuthorInput;
  publisher?: ArticlePublisherInput;
  url?: string;
}

export interface FaqQuestionInput {
  question: string;
  answer: string;
}

export interface BreadcrumbItemInput {
  name: string;
  url: string;
}
