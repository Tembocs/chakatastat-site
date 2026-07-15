# chakatastat.app

Marketing site for [ChakataStat](https://chakatastat.app/), a desktop app for
statistical data analysis.

Plain HTML/CSS/JS — no build step, no `node_modules`, no framework:

```
index.html          one-page site: hero, features, screenshots, analyze catalog, download, footer
css/styles.css       all styling (light/dark via prefers-color-scheme)
js/main.js           mobile nav toggle, footer year, screenshot lightbox
assets/
  logo-mark.svg       the ChakataStat brand mark
  favicon-256.png     favicon fallback / og:image placeholder
  screenshots/        real app screenshots (captured from an actual release build)
```

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

- [ ] Point the Download buttons (`index.html`, `#download` section) at real
      release artifacts instead of `#` placeholders.
- [ ] Replace the `og:image` placeholder (`assets/favicon-256.png`) with a
      proper 1200×630 social-preview card.
- [ ] Decide on a Documentation link once/if the User Guide is hosted
      publicly.

## Updating screenshots

The screenshots under `assets/screenshots/` were captured from a real
Windows release build of the app (driven directly, not mocked up) against
its sample dataset. Re-capture them the same way after a UI change worth
reflecting here — there's no scripted way to do this yet.
