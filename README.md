This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SEO Implementation

This project includes comprehensive SEO optimization:

- **Metadata**: Each page has unique titles, descriptions, and keywords tailored to its content.
- **Dynamic Metadata**: Dynamic routes (like movie/[slug]) generate metadata based on the content being displayed.
- **Structured Data**: JSON-LD schema markup for different content types (movies, shows, articles, events).
- **Image Optimization**: All images include descriptive alt text generated based on content context.
- **Sitemap Generation**: Automatic sitemap.xml generation during build process using next-sitemap.
- **Robots.txt**: Custom robots.txt file to guide search engine crawlers.
- **Open Graph & Twitter Cards**: Social media sharing metadata for better visibility on social platforms.

### Environment Variables

The following environment variables are used for SEO:

- `SITE_URL`: The base URL of the site (e.g., https://www.pimpim.ng)
- `GOOGLE_VERIFICATION`: Google Search Console verification code

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
