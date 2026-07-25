# chakatastat.app

Marketing site for [ChakataStat](https://chakatastat.app/), a desktop app for
statistical data analysis.

Plain HTML/CSS/JS — no build step, no `node_modules`, no framework:

```
index.html          one-page site: hero, validation, features, command stream,
                    screenshots, analyze catalog, download, footer
docs/                the User Guide — GENERATED, do not hand-edit (see below)
robots.txt           crawl policy; points at the sitemap
sitemap.xml          GENERATED with docs/; every public URL
css/styles.css       all styling (light/dark: system setting + a header toggle)
js/main.js           theme toggle, platform-aware download hint, tab groups,
                     scroll reveal, mobile nav, footer year, screenshot lightbox
assets/
  logo-mark.svg       the ChakataStat brand mark
  favicon-256.png     favicon fallback
  og-image.jpg        1200x630 social-preview card (og:image / twitter:image)
  fonts/              Inter (Latin subset, variable) — self-hosted, see below
  screenshots/        real app screenshots (captured from an actual release build)
```

## Licensing, in three parts

Three different things live in this repository under three different terms, and
conflating them is the easy mistake:

| | Terms |
|---|---|
| **The ChakataStat software** | Proprietary. Free to use for any purpose, including commercial use — but not open source. |
| **The documentation text** under `docs/` | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — share and adapt, including commercially, with attribution. |
| **The ChakataStat name and logo** | Trademarks. Not licensed for reuse; CC BY 4.0 does not cover them. |

Every generated documentation page carries that scope statement in its footer,
emitted by `tool/publish_docs.dart`. If the licence ever changes, change it
there — editing the HTML here is overwritten on the next render.

The site's own marketing copy (`index.html`, `quick-start/`, `privacy-policy/`)
is **not** CC BY; only the User Guide text is.

## `docs/` and `sitemap.xml` are generated — do not edit them here

Everything under `docs/` is the ChakataStat User Guide, rendered from Markdown
that lives in the (private) application repository. `sitemap.xml` is written by
the same tool. **Editing either by hand is pointless — the next release
overwrites it.** Fix the Markdown in the app repo and re-run:

```sh
dart run tool/publish_docs.dart --out /path/to/chakatastat-site
```

The same Markdown is bundled inside the application and rendered by its in-app
viewer, so the guide has two consumers and one source. That is also why an
unresolvable link fails the render rather than shipping a 404: a bad link is
usually broken in the app too.

## Things that will bite you when editing

- **The dark palette is written out twice** in `css/styles.css` — once behind
  `prefers-color-scheme` (excluding an explicit light choice) and once behind
  `[data-theme="dark"]`, because the theme has two independent triggers and
  plain CSS cannot reuse one block under two selectors. Keep them identical.
- **The hero's dark shot is a `<picture>` `<source>` keyed on a media query**,
  which the theme toggle cannot affect. `js/main.js` rewrites that source's
  `media` attribute when an explicit choice is active. If you touch either,
  check both: the failure mode is a dark page around a light screenshot.
- **Scroll reveal is armed from JavaScript**, not from the markup. That is
  deliberate — a CSS-only version starts at `opacity: 0`, so with scripts off
  the page would be blank rather than merely static.
- **Structured data carries the version.** The JSON-LD block in `index.html`
  has `softwareVersion`, and the download section prints it too. Both are part
  of the version-bump sweep, along with the footer citation on **all three**
  pages (the privacy policy was missed for six releases).
- Chrome's `--force-dark-mode` is **not** a faithful way to check dark mode:
  its auto-darkening filter blanks the already-dark screenshot. Force the
  media queries on instead, or just use the toggle.

## Fonts

`assets/fonts/inter-latin-var.woff2` is the Latin subset of the Inter
variable font (48 KB, the whole 100–900 weight range in one file). It is
**self-hosted on purpose**: the site makes no third-party requests at all, and
pulling the font from a CDN would quietly break that. It is preloaded in the
`<head>` of every page and declared once in `css/styles.css`, with the
`unicode-range` that matches the subset so anything outside Latin falls back
to the system stack rather than rendering as tofu.

## Previewing locally

Open `index.html` directly in a browser, or serve the folder with any static
file server, e.g.:

```sh
npx serve .
```

## Deploying

Static hosting of your choice (GitHub Pages, Netlify, Vercel, Cloudflare
Pages) pointed at the repo root, with the custom domain `chakatastat.app`
wired up through your DNS provider.

## Before going live — TODO

- [x] Windows download wired to the Microsoft Store listing.
- [x] Linux buttons wired: Snap Store listing + the `.deb` on the
      [chakatastat-releases](https://github.com/Tembocs/chakatastat-releases)
      releases page. (macOS remains deferred — no release path.)
- [ ] Decide on a Documentation link once/if the User Guide is hosted
      publicly.

## Updating screenshots

The screenshots under `assets/screenshots/` are real app captures (driven
directly, not mocked up) against the bundled sample dataset. They are
regenerated by the capture harness in the app repo —
`flutter test integration_test/snap_listing_shots_test.dart -d linux`
(or `-d windows`) writes the scenes to `qa_output/snap-store-shots/`. The
mapping onto this repo's assets:

| Scene | Asset | Used by |
|---|---|---|
| `01-data-editor` | `data-editor.png` | hero (light) + grid |
| `02-variable-view` | `variable-view.png` | grid |
| `03-frequencies-dialog` | `analyze-dialog.png` | grid |
| `04-frequencies-output` | `output-view.png` | grid |
| `05-histogram-dark` | `histogram-dark.png` | grid |
| `06-meta-analysis-forest` | `forest-plot.png` | grid |
| `07-data-editor-dark` | `data-editor-dark.png` | hero (dark) |

Scene 07 exists for this site rather than for the store listings: the hero
swaps its product shot on `prefers-color-scheme`, and a light capture on a
dark page looked wrong.

**Capture height differs by OS.** Linux yields 1920×1080; Windows yields
1920×1036, because the OS title bar and border eat into the client area. That
is why the hero's `<picture>` carries per-source `width`/`height` — the light
and dark shots currently come from different platforms, and each needs its own
aspect ratio to avoid a layout shift while loading. If you recapture both on
one platform, make the two attributes match again.

Refresh them whenever the app version bumps: the output scene's footer shows
the engine version, so a stale set misreports the release.
