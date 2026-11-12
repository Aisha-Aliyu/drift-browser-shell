# Changelog

All notable changes to DRIFT are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.1] - 2026-11-12

### Fixed
- Searches and sites that can't be shown in a frame no longer load as a blank white page. DRIFT checks each site first and shows an "Open in new tab" page when it can't display it.
- Searches now use the engine picked in Settings. Before, every search went to DuckDuckGo.
- Pressing Enter on the page that is already open reloads it instead of leaving the loading screen up.
- Home and "Go home" open the start page instead of DuckDuckGo.

### Changed
- Google is the default search engine, using Google's frame-friendly mode so results show inside DRIFT.
- Quick links start with Google and Wikipedia, which work inside DRIFT. Vercel and X were removed.

### Security
- The new public `/api/frame-check` route only returns a yes or no, refuses requests that browsers mark as coming from other sites, has per-visitor and overall rate limits, and refuses private, internal and non-standard-port addresses, including after redirects and DNS changes. It receives only a site's address, never the path or query string.

---

## [1.0.0] — 2026

### Added

**Core browser shell**
- Multi-tab browsing with open, close, switch, and duplicate tab support
- Address bar with smart URL resolution that detects domains, searches, and full URLs
- HTTPS / HTTP security badge per tab
- Incognito mode; tabs that record no history
- Navigation controls: back, forward, reload, stop, home
- Bookmark bar below the address bar

**New Tab page**
- Real-time clock with seconds
- Search bar defaulting to DuckDuckGo
- Eight quick-access site tiles
- Recent history list with timestamps
- DRIFT branding footer

**Sidebar**
- Browsing history panel with timestamps
- Bookmarks panel with remove action
- Empty states with descriptive illustrations
- Sidebar closes automatically on navigation

**Authentication and sync**
- Clerk authentication with email and Google OAuth
- Bookmarks synced to Neon PostgreSQL on save and remove
- History synced to Neon PostgreSQL on every page visit
- Data loads from database on sign-in
- Works fully without authentication and auth is additive

**Settings panel**
- Search engine picker are DuckDuckGo, Google, Bing
- Bookmark bar toggle
- Font size selector
- Clear history and downloads actions
- Keyboard shortcut reference

**Find in page**
- Ctrl+F opens find overlay
- Next and previous result navigation
- Cross-origin sites show informative notice

**Tab context menu**
- Right-click any tab to duplicate, reopen as incognito, reload, close, or close others

**Keyboard shortcuts**
- Ctrl+T: new tab
- Ctrl+W: close tab
- Ctrl+L: focus address bar
- Ctrl+R: reload
- Ctrl+Shift+N: incognito tab
- Alt+← / Alt+→: back / forward
- Ctrl+1–9: switch to tab by index

**Mobile**
- Edge swipe left to go back
- Edge swipe right to go forward
- Full responsive layout down to 320px width

**Notifications**
- Toast system for bookmark saved, bookmark removed, URL copied, history cleared

**Performance and security**
- Loading skeleton while iframe renders
- Rate limiting on all API routes; 100 requests per hour per IP via Upstash Redis
- Prisma ORM; all queries parameterized, no raw SQL
- URL sanitization; blocks javascript:, data:, and vbscript: schemes
- Per-user data scoping on all database operations
- Security response headers on all routes
- PWA manifest with offline-ready shell

---

## Roadmap

- [ ] Tab groups and pinned tabs
- [ ] Extension support
- [ ] Sync across multiple devices with conflict resolution
- [ ] Reading mode: strip pages to clean text
- [ ] Custom theme colors
- [ ] Export bookmarks as HTML
