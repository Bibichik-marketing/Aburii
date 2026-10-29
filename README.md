# ABURII

Production-ready Next.js App Router website for ABURII Japanese Yakiniku in TTDI.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

The project uses the standard Next.js `.next` build directory.

## GoDaddy Node.js Hosting

Use Node.js 22 and npm 10. Install with `npm ci`, build with `npm run build`,
and start with `npm start`. The server binds to `0.0.0.0` and honors the hosting
platform's `PORT` environment variable.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the migration findings, settings to
review, and verification steps.

## Vercel deployment

Import this repository into Vercel and keep the detected defaults:

- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: leave blank
- Install Command: `npm ci`

No Cloudflare, Wrangler, Vite, Vinext, static export, or custom output directory is required.
