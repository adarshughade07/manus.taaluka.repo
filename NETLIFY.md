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

The page now reads the real `submission_count` for `taaluka-waitlist` through the server-side Netlify Function at `/api/waitlist-count`. The count refreshes on page load, every 30 seconds, and after a successful form submission. The private API token is never sent to the browser.

### Enable the live count

The Function needs a Netlify personal access token with permission to read the site forms:

1. In Netlify, open **User settings → Applications → Personal access tokens** and create a token.
2. In the site, open **Site configuration → Environment variables**.
3. Add `NETLIFY_AUTH_TOKEN` with the token value and make sure its scope includes **Functions**.
4. Trigger a new deploy after saving the variable. `SITE_ID` is supplied automatically by Netlify to Functions.

If the token is missing or the Function has not been redeployed yet, the page safely shows `—` instead of an invented number.

## Local static build

```bash
pnpm install
pnpm build:netlify
```

The finished upload-ready site is in `dist/public`.
