# sulphated-web

Static storefront for [Sulphated](https://github.com/huntiezz/sulphated-web). All public files live in [`site/`](site/).

## Local preview

```bash
npm install
npm start
```

Open [http://localhost:4173](http://localhost:4173). Clean URLs (`/products`, `/product?id=fn`) use [`site/serve.json`](site/serve.json).

## Deploy on Vercel

Import this GitHub repo in [Vercel](https://vercel.com/new).

### Recommended (repo root)

| Setting              | Value                                             |
| -------------------- | ------------------------------------------------- |
| **Root Directory**   | _(leave empty — repository root)_                 |
| **Framework Preset** | Other                                             |
| **Build Command**    | _(empty)_                                         |
| **Output Directory** | _(empty — use root [`vercel.json`](vercel.json))_ |
| **Install Command**  | _(empty)_                                         |

Root [`vercel.json`](vercel.json) sets `"outputDirectory": "site"`, `cleanUrls`, and cache headers. Redeploy after connecting the repo.

### Alternative (site folder only)

| Setting             | Value     |
| ------------------- | --------- |
| **Root Directory**  | `site`    |
| **Build / Install** | _(empty)_ |

Uses [`site/vercel.json`](site/vercel.json). Do **not** also set a parent output directory.

## Repository layout

```
├── package.json      # local dev (serve)
├── vercel.json       # Vercel when Root Directory is repo root
└── site/             # HTML, CSS, JS, assets
    ├── index.html
    ├── vercel.json
    └── serve.json
```
