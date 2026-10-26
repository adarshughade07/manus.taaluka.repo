# Taaluka on Netlify

This project can be deployed as a standalone static site on Netlify. It does not require the Manus server, MySQL database, or tRPC API when built with the Netlify configuration.

## Deploy from the source folder

1. Upload this project folder to a new Netlify site, or connect the repository.
2. Netlify reads `netlify.toml` automatically.
3. The configured build command installs dependencies and runs `pnpm build:netlify`.
4. The publish directory is `dist/public`.

If Netlify asks for a package manager, use pnpm. The repository includes `pnpm-lock.yaml` and pins pnpm through `package.json`.

## Netlify Forms

The waitlist form is named `taaluka-waitlist`. Netlify discovers the hidden form in `client/index.html` during the build. The live React form submits URL-encoded `name` and `mobile` values to `/` when the static Netlify build is active.

After the first deployment:

1. Open the Netlify dashboard for the site.
2. Go to **Forms**.
3. Select `taaluka-waitlist` to view submissions or configure notifications.

Static Netlify mode intentionally does not show fabricated queue positions, referral progress, or live registration counts because those require a database-backed service. The page shows an honest confirmation after Netlify accepts the form submission.

## Local static build

```bash
pnpm install
pnpm build:netlify
```

The finished upload-ready site is in `dist/public`.
