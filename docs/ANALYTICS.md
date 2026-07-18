# Analytics

## Setup

Hugo Knowledge Hub uses Vercel Analytics. It is enabled by adding the `<Analytics />` component to the root layout.

No cookie banner is required. Vercel Analytics is privacy-friendly and does not use cookies or track individual users.

## How to access

Analytics are available in the Vercel dashboard:

1. Go to vercel.com and open the project.
2. Select the **Analytics** tab.

Analytics data is only collected on the production deployment. Local development does not send data.

## Available metrics

### Traffic

- **Page views** — total views per page, per day/week/month.
- **Unique visitors** — estimated unique visitors based on anonymous hashing.
- **Top pages** — which pages receive the most traffic.
- **Referrers** — where visitors come from (LinkedIn, Google, direct, etc.).
- **Countries** — geographic distribution of visitors.
- **Devices** — desktop, tablet, mobile breakdown.
- **Browsers and OS** — which browsers and operating systems visitors use.

### Per-page data

Every page on the site is tracked individually. Article URLs follow the pattern `/blog/[slug]`, so article-level performance is visible directly in the dashboard.

## Measuring article performance

To evaluate how an article performs:

1. Open the Analytics tab in Vercel.
2. Filter by the article URL, e.g. `/blog/eierskap-over-eget-innhold`.
3. Review page views, unique visitors, and referrer sources.

Useful comparisons:

- **Which articles get the most views?** Sort top pages by views.
- **Where does traffic come from?** Check referrers to see if LinkedIn posts drive visits.
- **When does traffic peak?** Check the time-series view after publishing a new article.

## What is not tracked

Vercel Analytics does not provide:

- Scroll depth or time on page.
- Click tracking or heatmaps.
- Individual user sessions.
- Conversion funnels.

These require additional tools (e.g. Plausible, PostHog) and are out of scope for the MVP.
