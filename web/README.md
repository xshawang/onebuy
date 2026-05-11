# Superbuy Clone (Demo)

Static, interactive Superbuy-style storefront. Built with React + Vite + TypeScript + Ant Design. All `/api/*` calls are intercepted by MSW, no real backend required.

See [`../docs/实施方案.md`](../docs/实施方案.md) for the full plan (in Chinese).

## Features

- Home page (banner carousel, services strip, hot products grid, header search)
- Product detail page (image gallery, SKU picker, quantity stepper, add-to-cart)
- Solution detail page (packaging options + step flow)
- Login / Register with mock auth (any non-empty credentials work; registered emails are checked for duplicates in-memory)
- i18n: `zh` / `en` switchable at runtime
- Currency: `CNY` / `USD` switchable at runtime (fixed rate 1 CNY = 0.14 USD)
- Cart (badge in header) persisted via localStorage

## Quick start

```bash
cd web
npm install

# One-time: generate the MSW service worker into public/
npx msw init public/ --save

npm run dev
```

Open http://localhost:5173 .

## Try it

- Switch language / currency from the top-right corner.
- Use the header search box (e.g. `项链`, `jacket`).
- Open a product (e.g. `p001`) → pick a color/size → **Add to cart**.
- Click **Packaging solutions** tab on the product page to see `/solution/sol_standard` or `/solution/sol_premium`.
- Sign in with `demo / demo123` (or anything non-empty).
- Register any new email to auto-login.

## Project layout

```
web/
  src/
    api/           # typed fetch wrappers
    components/    # layout, common, product
    i18n/          # zh.json / en.json
    mocks/         # MSW handlers + JSON fixtures
    pages/         # 5 pages + NotFound
    stores/        # zustand: auth / cart / settings
    utils/         # currency, format
```

## Notes

- Product/packaging images reference `/images/...` paths; you can drop real images into `web/public/images/` (copied from `../html/*_files/`) or rely on the built-in placeholder fallback.
- No real backend, no real payments. Do not use for production.
