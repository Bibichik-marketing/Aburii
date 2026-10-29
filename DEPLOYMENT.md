# GoDaddy Node.js Hosting — npm migration

## Findings and limits

The repository previously contained both `package-lock.json` and `pnpm-lock.yaml`,
plus `pnpm-workspace.yaml` and tracked `.pnpm-store` database files. The pnpm files
were introduced during local preview setup and committed in `4d9032f`. They are
package-manager detection signals; the app itself does not require pnpm.
The workspace file also contained an invalid placeholder in `allowBuilds`.

The reported `pnpm-native EACCES` indicates a permissions failure in the pnpm
execution path. The complete deployment log and live GoDaddy settings have not
been supplied or inspected, so the exact failing executable/path and the host's
package-manager selection precedence remain unconfirmed. This change removes
the repository's pnpm detection signals; it does not change hosting permissions.

## Changes prepared for review (not deployed)

- Use Node.js 22 (`engines.node` and `.nvmrc`) and npm 10; record npm 10.9.9 in
  `packageManager`. Only the npm lockfile remains.
- Remove pnpm lock/workspace files and tracked pnpm store databases; ignore local
  stores and TypeScript cache files in future commits.
- Preserve the current pnpm lockfile's direct application versions: GSAP 3.15.0
  and lucide-react 1.59.0 are pinned instead of reverting to the older npm lock's
  3.13.0 and 1.31.0. Other direct dependency versions remain unchanged. Transitive
  resolution follows the regenerated npm lockfile, not the former pnpm graph.
- Put existing build dependencies (Tailwind, TypeScript, type declarations,
  ESLint and eslint-config-next) in `dependencies`: GoDaddy documents a
  production-only install before building. Nothing new is added to the app.
- Keep `build` as `next build`, invoked with `npm run build`.
- Use `npm start` -> `next start --hostname 0.0.0.0`. Next.js 15.5.26 reads the
  runtime `PORT` variable; no fixed port or custom server is introduced.
- No website source, styling, content, routing or animation changes.

## Hosting settings to review before deployment

These are required/recommended values, not a report of the current dashboard.

| Setting | Value |
| --- | --- |
| Project/application root | Repository root (`.`), containing `package.json` |
| Node.js | 22.x |
| Package manager | npm (remove any pnpm override) |
| Install command, if configurable | `npm ci` |
| Build command | `npm run build` |
| Start/run command | `npm start` |
| Build output | Standard Next.js `.next`; do not select static `out` or `dist` |
| Environment | `NODE_ENV=production`; allow GoDaddy to assign `PORT` |

If GoDaddy handles install automatically, its documented `npm install` flow is
compatible with this package and lockfile. Do not add a second install to the
build command. Do not set `PORT` to 3000 in hosting settings.

If the dashboard has cached pnpm detection, choose npm explicitly where supported
and clear the build/dependency cache before rebuilding. If it still invokes
pnpm with an npm-only upload and no dashboard override, send GoDaddy support the
full log: this is a hosting-side selection/permissions issue.

For ZIP uploads, put `package.json` at the ZIP root. Include `package-lock.json`,
source/configuration and `public/`. Exclude `.git`, `node_modules`, `.next`,
`.pnpm-store`, local caches, `.env` secrets and prior deployment archives.
`.openai/hosting.json` is existing Sites metadata, not GoDaddy configuration.
No GoDaddy-specific deployment configuration file was found in this repository.

## Local reproduction

```sh
nvm use
npm ci --omit=dev
npm run build
PORT=43127 npm start
# From a separate terminal:
curl -I http://127.0.0.1:43127/
```

The build must finish successfully, and the production server must respond on
43127, demonstrating that the platform-assigned port is honored. The temporary
port is for verification only. Stop that test server afterward.

## References

- https://developer.godaddy.com/en/docs/api-users/hosting/app-requirements
- https://www.godaddy.com/en-ph/help/godaddy-nodejs-hosting-faq-42915

Review these changes and the actual GoDaddy settings before deploying. No publish,
DNS, remote settings or production environment changes are part of this fix.

## Verification completed

Tested in a clean temporary source copy on macOS arm64 with official Node.js
22.23.4 (archive SHA-256 verified) and its bundled npm 10.9.9:

- `npm ci --omit=dev`: passed using the final npm lockfile (327 packages).
- `npm run build`: passed, including lint/type checks and static page generation.
- `PORT=43127 npm start`: ready on `0.0.0.0:43127`.
- HTTP 200: `/`, `/about`, `/menu`, `/visit`, `/zh`, `/zh/about`, `/zh/menu`,
  `/zh/visit`, `/menu/page-01.webp`, `/hero/v2/wagyu-whole.png`.
- Test server stopped after verification.
- `git diff --check`: passed; no changes under `app/`, `components/`, `lib/` or
  `public/`.

This validates Node 22/npm compatibility locally. It does not constitute a Linux
GoDaddy build, a hosted preview, confirmation of dashboard settings or a publish.
