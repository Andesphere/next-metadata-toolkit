import type { JsonLdData } from '../types';

export interface JsonLdProps<T extends JsonLdData = JsonLdData> {
  data: T;
  id?: string;
}

/**
 * Server Component that renders JSON-LD structured data.
 */
export const JsonLd = <T extends JsonLdData>({ data, id }: JsonLdProps<T>) => {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};
