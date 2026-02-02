# next-metadata-toolkit

**Thin, type-safe helpers for the Next.js App Router Metadata API plus JSON-LD utilities.**

[![npm version](https://img.shields.io/npm/v/next-metadata-toolkit.svg)](https://www.npmjs.com/package/next-metadata-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🎯 **Sensible defaults** — wraps Next.js `Metadata` so you write less boilerplate
- 🔀 **Deep merge** — global Open Graph & Twitter settings cascade to every page
- 🏷️ **Typed JSON-LD** — schema helpers powered by `schema-dts` (types only, no runtime bloat)
- 📦 **Zero dependencies** — just your app and Next.js

---

## 📦 Installation

```bash
npm install next-metadata-toolkit
# or
pnpm add next-metadata-toolkit
# or
yarn add next-metadata-toolkit
```

---

## 🚀 Quick Start

### 1. Global config (root layout)

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

### 2. Per-page metadata

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

> 💡 **Tip:** Use `pathname` instead of `canonical` when you only have the path:
>
> ```ts
> makePageMetadata({
>   title: 'Pricing',
>   description: 'Simple pricing for growing teams.',
>   pathname: '/pricing',
> });
> ```

### 3. JSON-LD structured data

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

<details>
<summary><strong>Article + Breadcrumb example</strong></summary>

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

</details>

---

## 📖 API Reference

### `createSeoConfig(input)`

Builds global defaults for your root layout and stores them for page-level merging.

| Option | Type | Description |
|--------|------|-------------|
| `siteName` | `string` | Site or brand name **(required)** |
| `baseUrl` | `string` | Absolute site URL — sets `metadataBase` **(required)** |
| `titleTemplate` | `string` | Title template (default: `%s \| ${siteName}`) |
| `defaultTitle` | `string` | Fallback title (default: `siteName`) |
| `defaultDescription` | `string` | Default meta description |
| `defaultOgImage` | `string` | Default OG/Twitter image (relative or absolute) |
| `twitterHandle` | `string` | `@handle` for Twitter cards |
| `locale` | `string` | Open Graph locale (e.g. `en_US`) |

---

### `makePageMetadata(input)`

Creates page-level metadata and deep-merges OG/Twitter with global defaults.

| Option | Type | Description |
|--------|------|-------------|
| `title` | `string` | Page title |
| `description` | `string` | Meta description |
| `canonical` | `string` | Canonical URL or path |
| `pathname` | `string` | Convenience for canonical from path |
| `openGraph` | `object` | Open Graph overrides |
| `twitter` | `object` | Twitter card overrides |

---

### `<JsonLd data={...} />`

Server Component that renders a `<script type="application/ld+json">` tag.

```tsx
<JsonLd data={organizationSchema({ name: 'Example', url: 'https://example.com' })} />
```

---

### Schema Helpers

All helpers return `WithContext<T>` from `schema-dts`:

| Helper | Schema Type |
|--------|-------------|
| `organizationSchema()` | Organization |
| `websiteSchema()` | WebSite (with optional SearchAction) |
| `productSchema()` | Product (includes Offer) |
| `articleSchema()` | Article |
| `faqPageSchema()` | FAQPage |
| `breadcrumbSchema()` | BreadcrumbList |

---

## 📝 Notes

- **`metadataBase` is required** for correct absolute URL generation — always pass `baseUrl` to `createSeoConfig`
- Open Graph images work best at **1200×630**
- Next.js merges metadata shallowly; this package **deep-merges** OG and Twitter for you
- For dynamic pages, consider `React.cache()` to share data between `generateMetadata` and the page component
- FAQ pages typically perform best with **≤10 questions**

---

## 📄 License

[MIT](LICENSE) © Andy Partner
