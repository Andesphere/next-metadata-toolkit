import type { JsonLdData } from '../types';
import { warnDev } from '../utils';

export interface JsonLdProps<T extends JsonLdData = JsonLdData> {
  data: T;
  id?: string;
}

const escapeJson = (value: string) =>
  value.replace(/[<>&"']/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003c';
      case '>':
        return '\\u003e';
      case '&':
        return '\\u0026';
      case '"':
        return '\\u0022';
      case "'":
        return '\\u0027';
      default:
        return char;
    }
  });

const safeStringify = (data: JsonLdData): string | undefined => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    warnDev(
      'jsonld-stringify',
      `Failed to serialize JSON-LD data. Ensure values are JSON-serializable. (${String(error)})`
    );
    return undefined;
  }
};

/**
 * Server Component that renders JSON-LD structured data.
 */
export const JsonLd = <T extends JsonLdData>({ data, id }: JsonLdProps<T>) => {
  const json = safeStringify(data);
  if (!json) {
    return null;
  }
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: escapeJson(json) }}
    />
  );
};
