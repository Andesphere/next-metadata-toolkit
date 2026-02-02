import type { Metadata } from 'next';

export interface SeoDefaults {
  metadataBase: URL;
  titleTemplate?: string;
  defaultTitle: string;
  defaultDescription?: string;
  openGraph?: Metadata['openGraph'];
  twitter?: Metadata['twitter'];
}

let seoDefaults: SeoDefaults | null = null;

export const setSeoDefaults = (next: SeoDefaults) => {
  seoDefaults = next;
};

export const getSeoDefaults = () => seoDefaults;
