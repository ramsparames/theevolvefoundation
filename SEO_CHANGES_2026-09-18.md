# SEO changes — 18 September 2026

- Added canonical URLs to the homepage, Launchpad, Ignite and founder page.
- Added page-specific Open Graph and Twitter/social preview metadata.
- Improved Launchpad and Ignite search titles and meta descriptions without changing visible page copy.
- Added Schema.org JSON-LD connecting The Evolve Foundation, Rams Parameswaran, the official website, LinkedIn identities, Launchpad and Ignite.
- Expanded sitemap.xml from the homepage only to all four core indexable pages.
- Added permanent Vercel redirects from legacy Campus Launchpad / for-colleges URLs to Ignite.
- Added noindex fallback redirect pages for those legacy URLs.
- No visual design changes were made.

## After deployment
1. Confirm Vercel production domain redirects consistently to the preferred hostname.
2. Add/verify the domain property in Google Search Console.
3. Submit https://theevolvefoundation.com/sitemap.xml.
4. Inspect and request indexing for /, /launchpad.html, /ignite.html and /about-rams.html.
5. Inspect the two legacy URLs and confirm Google sees their permanent redirects to /ignite.html.
