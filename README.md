# next-metadata-toolkit

Thin, type-safe helpers for the Next.js App Router Metadata API plus JSON-LD utilities.

- Wraps Next.js `Metadata` with sensible defaults
- Preserves global Open Graph/Twitter defaults via deep merge
- Typed JSON-LD helpers using `schema-dts` (types only)
- Zero runtime dependencies

## Install

```bash
npm install next-metadata-toolkit
# or
pnpm add next-metadata-toolkit
# or
yarn add next-metadata-toolkit
```

## Quick Start

### 1) Global config (root layout)

```tsx
// app/layout.tsx
import { createSeoConfig } from 'next-metadata-toolkit';

export const metadata = createSeoConfig({
  siteName: 'Andy Partner',
  titleTemplate: '%s | Andy Partner',
  defaultTitle: 'Andy Partner – AI Chatbot for Small Business',
  defaultDescription: 'Custom AI chatbots that help small businesses capture and convert leads.',
  baseUrl: 'https://andypartner.com',
  defaultOgImage: '/og-default.png',
  twitterHandle: '@andypartner',
  locale: 'en_US',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2) Per-page metadata

```tsx
// app/blog/[slug]/page.tsx
import { makePageMetadata } from 'next-metadata-toolkit';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return makePageMetadata({
    title: post.title,
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,
    openGraph: {
      type: 'article',
      images: [{ url: post.coverImage }],
      publishedTime: post.publishedAt,
    },
  });
}
```

Tip: If you have the pathname but not a canonical URL, you can pass `pathname` instead:

```ts
makePageMetadata({
  title: 'Pricing',
  description: 'Simple pricing for growing teams.',
  pathname: '/pricing',
});
```

### 3) JSON-LD

```tsx
// app/page.tsx
import { JsonLd, organizationSchema, websiteSchema } from 'next-metadata-toolkit';

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={organizationSchema({
          name: 'Andy Partner',
          url: 'https://andypartner.com',
          logo: 'https://andypartner.com/logo.png',
          sameAs: [
            'https://twitter.com/andypartner',
            'https://linkedin.com/company/andypartner',
          ],
        })}
      />
      <JsonLd
        data={websiteSchema({
          name: 'Andy Partner',
          url: 'https://andypartner.com',
          searchUrl: 'https://andypartner.com/search?q={search_term_string}',
        })}
      />
      {/* Page content */}
    </>
  );
}
```

```tsx
// app/blog/[slug]/page.tsx
import { JsonLd, articleSchema, breadcrumbSchema } from 'next-metadata-toolkit';

export default function BlogPost({ post }: { post: Post }) {
  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { name: post.author.name },
          publisher: {
            name: 'Andy Partner',
            logo: 'https://andypartner.com/logo.png',
          },
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />
      {/* Post content */}
    </>
  );
}
```

## API

### `createSeoConfig(input)`

Builds global defaults for your root layout and stores them for page-level merging.

```ts
import type { SeoConfigInput } from 'next-metadata-toolkit';
```

Key options:

- `siteName`: Site or brand name (required)
- `titleTemplate`: Title template (default: `%s | ${siteName}`)
- `defaultTitle`: Default title (default: `siteName`)
- `defaultDescription`: Default meta description
- `baseUrl`: Absolute site URL (required). Sets `metadataBase`
- `defaultOgImage`: Default Open Graph/Twitter image (relative or absolute)
- `twitterHandle`: `@handle` for Twitter metadata
- `locale`: Open Graph locale (e.g. `en_US`)

### `makePageMetadata(input)`

Creates page-level metadata and deep-merges Open Graph/Twitter with the global defaults.

Additional fields:

- `canonical`: Canonical URL or path (relative ok when `metadataBase` is set)
- `pathname`: Convenience for generating canonical URLs from a path

### `<JsonLd />`

Server Component to render JSON-LD:

```tsx
<JsonLd data={organizationSchema({ name: 'Example', url: 'https://example.com' })} />
```

### Schema helpers

All helpers return `WithContext<T>` objects from `schema-dts`:

- `organizationSchema()`
- `websiteSchema()` (optional `SearchAction`)
- `productSchema()` (includes `Offer`)
- `articleSchema()`
- `faqPageSchema()`
- `breadcrumbSchema()`

## Notes

- `metadataBase` is required for correct absolute URL generation. Always pass `baseUrl` to `createSeoConfig`.
- Open Graph images work best at `1200x630`.
- Next.js merges metadata shallowly. This package deep-merges Open Graph and Twitter for you.
- For dynamic pages, consider `React.cache()` to share data between `generateMetadata` and the page component.
- FAQ pages typically perform best with ~10 questions or fewer.

## License

MIT
