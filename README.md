# docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |
| `app/analytics-dashboard` | Hidden analytics dashboard (see ANALYTICS.md).         |

### Analytics Dashboard

This project includes a hidden analytics dashboard accessible at `/analytics-dashboard`. 

**Features:**
- 📊 Track page views, unique visitors, and top pages
- 🔒 Protected by 6-digit authentication code
- 💰 100% free - no external services
- 🚀 Works on Vercel's free tier

**Setup:**
1. Set your 6-digit code in environment variables:
   - Local: Add `ANALYTICS_CODE=123456` to `.env`
   - Vercel: Add environment variable `ANALYTICS_CODE` in project settings
2. Access at: `https://your-domain.com/analytics-dashboard`
3. Enter your code to view analytics

See [ANALYTICS.md](./ANALYTICS.md) for detailed documentation.

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
